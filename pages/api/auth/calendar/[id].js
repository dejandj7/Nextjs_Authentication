import nextConnect from 'next-connect';
import middleware from '../../../../middleware/middleware';
import mongodb from 'mongodb';
const handler = nextConnect();

handler.use(middleware);

const deleteReservation = async (req) => {
  const { query: { id } } = req;
  const query = { _id: new mongodb.ObjectID(id) };
  return await req.db.collection('customers')
    .deleteOne(query).then(() => {
      return { status: 'success' };
    }).catch(error => {
      return Promise.reject({ status: error.toString() });
    });
}

const getByID = async (req) => {
  const { query: { id } } = req;
  const query = { _id: new mongodb.ObjectID(id) };

  return await req.db
    .collection('calendar')
    .findOne(query)
    .then((data) => {
      return data
    })
    .catch(error => {
      return Promise.reject(
        {
          status: 'error',
          message: error.error,
        }
      )
    });
}

const checkReservationExists = async (req, date, email) => {
  return await req.db
    .collection('calendar')
    .countDocuments({ date, email })
    .then((count) => {
      return count
    })
    .catch(error => {
      return Promise.reject(
        {
          status: 'error',
          message: error.error,
        }
      )
    });
}

const updateReservation = async (req) => {
  const { _id, email, date } = req.body;
  return await req.db
    .collection('calendar')
    .updateOne(
      { _id: new mongodb.ObjectID(_id) },
      { $set: { date, email } }
    ).then(response => {
      return { status: 'ok' }
    }).catch(error => {
      return {
        status: 'error',
        message: error.toString(),
      }
    });

}

handler.delete((req, res) => {
  if (!req.user) return res.status(401).send('You need to be logged in.');
  return deleteReservation(req).then(data => {
    return res.status(204).send({});
  }).catch(error => {
    return Promise.reject(
      res.status(200).send({
        status: error.toString()
      })
    )
  });
});

handler.put((req, res) => {
  if (!req.user) return res.status(401).send('You need to be logged in.');

  return getByID(req).then(data => {

    if (data && data.email === email) {
      return updateReservation(req).then(data => {
        return res.status(201).send({
          status: 'ok',
          message: 'Reservation updated successfully',
        })
      }).catch(error => {
        return res.status(200).send(error);
      });
    } else {
      return checkReservationExists(req, date, email).then(count => {
        if (count > 0) {
          return updateUser(req).then(data => {
            res.status(201).send({
              status: 'ok',
              message: 'Reservation updated successfully',
            })
          }).catch(error => {
            res.status(200).send(error);
          });
        }
      }).catch(error => {
        res.status(200).send(error);
      });
    }
  })

});

handler.get((req, res) => {
  if (!req.user) return res.status(401).send('You need to be logged in.');
  return getByID(req).then(data => {
    return res.json(data);
  }).catch(error => {
    return Promise.reject(
      res.status(200).send({
        status: error.toString()
      })
    )
  });
});


export default handler;