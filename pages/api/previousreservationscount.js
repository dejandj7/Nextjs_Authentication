import nextConnect from "next-connect";
import { unstable_getServerSession } from "next-auth"
import middleware from "../../middleware/database";

const handler = nextConnect();

handler.use(middleware);

const getByID = async (req) => {
  const {
    query: { id },
  } = req;
  const query = { _id: id };
  console.debug(query);
  return await req.db
    .collection("previousReservationsCount")
    .findOne(query)
    .then((data) => {
      return data;
    })
    .catch((error) => {
      return Promise.reject({
        status: "error",
        message: error.error,
      });
    });
};

handler.get((req, res) => {
  if (!req.user) return res.status(401).send("You need to be logged in.");
  return getByID(req)
    .then((data) => {
      return res.json(data);
    })
    .catch((error) => {
      return Promise.reject(
        res.status(200).send({
          status: error.toString(),
        })
      );
    });
});

export default handler;