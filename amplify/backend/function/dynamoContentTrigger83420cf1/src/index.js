const AWS = require('aws-sdk');
AWS.config.update({ region: 'eu-west-3' });
const ses = new AWS.SES();

/**
* @type {import('@types/aws-lambda').DynamoDBStreamHandler}
*/

// async function verifyEmailAddress(emailAddress) {
//   try {
//     const params = {
//       EmailAddress: emailAddress,
//     };

//     await ses.verifyEmailAddress(params).promise();
//     console.log(`Successfully verified email address: ${emailAddress}`);
//   } catch (error) {
//     console.error(`Error verifying email address ! ${emailAddress}:`, error);
//   }
// }

exports.handler = async (event, context) => {
  console.log(JSON.stringify(event, null, 2));
  try {
    for (const record of event.Records) {
      if (record.eventName === "INSERT") {
        const destination = "douniabakhkhouch2000@gmail.com";
        const messageContent = record.dynamodb.NewImage.comment.S;
        // Create the email parameters
        const params = {
          Destination: {
            ToAddresses: [destination],
          },
          Message: {
            Body: {
              Text: { Data: messageContent },
            },
            Subject: { Data: "Sent from my platform" },
          },
          Source: "douniabakhkhouch2000@gmail.com",

        };
        // Send the email using SES
        await ses.sendEmail(params).promise();
        console.log(`Email sent to ${destination}`);
      }
    }
    context.done(null, 'Successfully processed DynamoDB record');
  } catch (error) {
    console.error('Error sending email:', error);
    context.done(error, 'Error processing DynamoDB record');
  }
};