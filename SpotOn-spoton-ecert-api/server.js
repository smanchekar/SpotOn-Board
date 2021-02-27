import Express, { json } from "express";
import path from "path";
import { ApolloServer } from "apollo-server-express";
import glue from "schemaglue";
import config from "./config/config";
import assets from "./src/business/assets";
import cors from "cors";
const { schema, resolver } = glue("src/graphql");

const APP_PORT = config.appPort;

const app = Express();

const server = new ApolloServer({
    typeDefs: schema,
    resolvers: resolver,

    context: ({ req }) => {
        // add referer to the context
        const ref = req.headers.referer || "";
        // config.requestHost =
        //     req.headers["x-forwarded-for"] || req.client.remoteAddress;

        const token = req.header("x-authorization");

        return { referer: ref, token };
    },
    playground: {
        // endpoint: `http://10.6.6.149:5040/graphql`,
        endpoint: "http://localhost:4040/graphql",
        settings: {
            "editor.theme": "light",
        },
    },
    // context: ({ req }) => {
    //         // add referer to the context
    //         const ref = req.headers.referer || '';
    //         return {referer: ref}
    // }
});

app.use(cors());
app.get("/asset/:type/:id", function (req, res) {
    console.log(req.params);
    if (req.params.type.toLowerCase() == "cardid") {
        assets.processcdimage({ carddetid: req.params.id }, res);
    } else {
        res.status(404); // HTTP status 404: NotFound
        res.send(req.params.type + " for id: " + req.params.id + " Not found");
    }
});

app.use("/images", Express.static(path.join(config.assetBasePath)));

// app.use('/graphql',
//         bodyParser.json({ limit: "50mb" }),
//         graphqlExpress(request => ({
//                 schema: executableSchema,
//                 context: { referer: request.headers['referer'] }
//         })));

// GraphiQL, a visual editor for queries
//app.use('/graphiql', graphiqlExpress({ endpointURL: '/graphql' }));

app.get("/:groupId/:merchantId", function (req, res) {
    res.sendFile(path.join(config.webBuildPath, "index.html"));
});

app.get("/cardid/:cardid/itemid/:itemid/claim", function (req, res) {
    res.sendFile(path.join(config.webBuildPath, "index.html"));
});

app.get("/health", (req, res) => {
    res.status(200).send({ status: "SERVER_IS_UP" });
    // const Client = require('pg').Client;

    // const client = new Client({
    //         host: config.database.dbhost,
    //         port: config.database.dbport,
    //         database: config.database.dbname,
    //         user: config.database.dbusername,
    //         password: config.database.dbpassword
    // });
    // client.connect((err) => {
    //         if(err) {
    //                 console.log(err);
    //                 return res.status(404).send({status:'DATABASE_CONNECTION_FAILED'});
    //         } else {
    //                 client.end((err) => {
    //                         if(err) {
    //                                 console.log(err);
    //                                 throw err;
    //                         }
    //                 });
    //                 return res.status(200).send({status:'SERVER_IS_UP'});
    //         }
    // });
});
// viewed at http://localhost:4040
app.use("/", Express.static(path.join(config.webBuildPath)));

app.use(json({ limit: "10mb" }));
server.applyMiddleware({ app });

app.use(function (err, req, res, next) {
    console.log(err);
    res.status(404).send("Unable to find the requested resource!");
});

app.listen(APP_PORT, () => {
    console.log(`App listening on port ${APP_PORT}`);
});

//server.timeout = (1000 * 60 * 10);
