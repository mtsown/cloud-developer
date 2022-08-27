import express, { Request, Response } from 'express';
import bodyParser from 'body-parser';
import { filterImageFromURL, deleteLocalFiles } from './util/util';

(async () => {

  // Init the Express application
  const app = express();

  // Set the network port
  const port = process.env.PORT || 8082;

  // Use the body parser middleware for post requests
  app.use(bodyParser.json());

  app.get("/filteredimage", async (req: Request, res: Response) => {
    const imageUrl = req.query.image_url;

    // 1. Validate the image_url query
    if (!imageUrl) {
      res.status(400).send({ message: 'Image url is required' });
    }

    try {
      // 2. Filter the image
      const filteredImagePath = await filterImageFromURL(imageUrl);

      // 3. Send the resulting file in the response
      res.status(200).sendFile(filteredImagePath);

      // 4. Deletes any files on the server on finish of the response
      res.on('finish', () => deleteLocalFiles([filteredImagePath]));
    }
    catch (error) {
      res.status(422).send({ message: 'Unable to handle request. ' + error })
    }
  });

  // Root Endpoint
  // Displays a simple message to the user
  app.get("/", async (req, res) => {
    res.send("try GET /filteredimage?image_url={{}}")
  });


  // Start the Server
  app.listen(port, () => {
    console.log(`server running http://localhost:${port}`);
    console.log(`press CTRL+C to stop server`);
  });
})();