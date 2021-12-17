import Document, { Html, Head, Main, NextScript } from "next/document";
import { styled } from "@mui/material";

const Body = styled("body")(({ theme }) => ({
  backgroundColor: theme.palette.grey[100],
}));

class MyDocument extends Document {
  render() {
    return (
      <Html>
        <Head>
          <link
            href="https://fonts.googleapis.com/css2?family=Inter&display=optional"
            rel="stylesheet"
          />
        </Head>
        <Body>
          <Main />
          <NextScript />
        </Body>
      </Html>
    );
  }
}

export default MyDocument;
