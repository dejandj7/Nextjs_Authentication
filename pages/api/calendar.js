import nextConnect from "next-connect";
import middleware from "../../middleware/database";

const handler = nextConnect();

handler.use(middleware);

const addReservation = async (req) => {
  const { email, name, date } = req.body;
  return await req.db
    .collection("calendar")
    .insertOne({ email, name, date })
    .then((response) => {
      return { status: "ok" };
    })
    .catch((error) => {
      return {
        status: "error",
        message: error.toString(),
      };
    });
};

handler.get(async (req, res) => {
  console.debug(req);
  let doc = await req.db
    .collection("calendar")
    .findOne({ _id: req.email });
  res.json(doc);
});

handler.post((req, res) => {
  //if (!req.user) return res.status(401).send('You need to be logged in.');
  return addReservation(req)
    .then((data) => {
      return res.status(201).send({
        status: "ok",
        message: "Reservation added successfully",
      });
    })
    .catch((error) => {
      return res.status(200).send(error);
    });
});

export default handler;
