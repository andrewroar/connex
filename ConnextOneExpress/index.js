const express = require("express");
const promMid = require('express-prometheus-middleware');
const PORT = process.env.PORT || 3000;
const cors = require("cors");
const Ajv = require("ajv")
const ajv = new Ajv()
const timeSchema = require("./schema/timeSchema.json")



const app = express();


app.get('/', (req, res) => {
    res.send("<div>Connex Express.js is Online</div>")
})

const authMiddleware = (req, res, next) => {
    if (!req.headers.authorization) {
        return res.status(403).json({ error: 'no credential' });
    }

    if (req.headers.authorization !== "mysecrettoken") {
        return res.status(403).json({ error: 'credential not correct' });
    }
    next();

}

app.use(
    cors({
        methods: "GET,HEAD,PUT,PATCH,POST,DELETE"
    })
);



app.get('/', (req, res) => {
    res.send("<div>Connex Express.js is Online</div>")
})

const validateResponseWithSchema = (json, schema, res) => {
    const valid = ajv.validate(schema, json);
    if (!valid) {

        return res.status(500).json({
            error: 'Response data does not match the expected schema',
            details: ajv.errors,
        });

    }

}

app.get('/time', authMiddleware, (req, res) => {
    const responseJson = { epoch: Date.now() }
    validateResponseWithSchema(responseJson, timeSchema, res)
    res.json(responseJson)
})

app.use(authMiddleware, promMid({
    metricsPath: '/metrics',
    collectDefaultMetrics: true,
    requestDurationBuckets: [0.1, 0.5, 1, 1.5],
    requestLengthBuckets: [512, 1024, 5120, 10240, 51200, 102400],
    responseLengthBuckets: [512, 1024, 5120, 10240, 51200, 102400],
}));


//Error Handling
app.use((req, res, next) => {
    res.status(404).json({ error: 'Not found' });
});

app.use((err, req, res, next) => {
    console.error(err);
    res.status(500).json({ error: 'Internal Server Error' });
});



app.listen(PORT, () => {
    console.log(`🌎 ==> API server now on port http://localhost:${PORT}/`);
});
