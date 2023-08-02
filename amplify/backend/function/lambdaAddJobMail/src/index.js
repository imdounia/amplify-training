  const AWS = require('aws-sdk');

  const dynamoDB = new AWS.DynamoDB.DocumentClient();

  /**
   * @type {import('@types/aws-lambda').APIGatewayProxyHandler}
   */
  exports.handler = async (event) => {

    try {
      const requestBody = JSON.parse(event.body);
      const message = requestBody.message;

      if (!message) {
        return {
          statusCode: 400,
          headers: {
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Headers": "*"
          },
          body: JSON.stringify({ message: "Le champ message est requis." })
        };
      }
      const params = {
        TableName: "dynamoContent-dev",
        Item: {
          comment: message
        }
      };
      await dynamoDB.put(params).promise();

      console.log("OUAI OAUI CEST ICI");

      return {
        statusCode: 200,
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Headers": "*"
        },
        body: JSON.stringify({ message: "Contenu enregistré avec succès." })
      };
    } catch (error) {
      console.error('Error saving message to DynamoDB:', error);
      return {
        statusCode: 500,
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Headers": "*"
        },
        body: JSON.stringify({ message: "Une erreur est survenue lors de l'enregistrement du contenu." })
      };
    }
  };