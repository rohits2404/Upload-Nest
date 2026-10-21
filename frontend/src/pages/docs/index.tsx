import { Link } from "react-router-dom";
import { Light as SyntaxHighlighter } from "react-syntax-highlighter";
import atomOneDark from "react-syntax-highlighter/dist/esm/styles/hljs/atom-one-dark";
import atomOneLight from "react-syntax-highlighter/dist/esm/styles/hljs/atom-one-light";
import js from "react-syntax-highlighter/dist/esm/languages/hljs/javascript";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { PageLayout } from "@/components/layouts/page-layout";
import { PROTECTED_ROUTES } from "@/routes/common/routePath";
import { useTheme } from "@/provider/theme-provider";

SyntaxHighlighter.registerLanguage("javascript", js);

const Docs = () => {
    const { theme } = useTheme();
    const public_baseurl = `${import.meta.env.VITE_API_URL}`;
    const codeTheme = theme === "light" ? atomOneLight : atomOneDark;
    const backgroundColor = theme === "dark" ? "#161616" : "#fafafa";

    return (
        <PageLayout title="Docs" subtitle="Uploadnest API Documentation">
            <div className="mx-auto px-1">
                <div className="mb-8">
                    <h2 className="text-lg font-semibold">
                        TypeScript/JavaScript SDK
                    </h2>
                    <p className="text-sm text-muted-foreground mb-6">
                        TypeScript Library For Uploading Files To Uploadnest
                        API. Works In Node.js, Next.js, And Browsers. Remember
                        To Create Your API Key On Your{" "}
                        <Link
                            to={PROTECTED_ROUTES.APIKEYS}
                            className="text-primary underline"
                        >
                            API Keys Page
                        </Link>
                        .
                    </p>

                    <Card className="mb-5">
                        <CardHeader>
                            <CardTitle>Installation</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="overflow-hidden rounded-lg border">
                                <SyntaxHighlighter
                                    language=""
                                    style={codeTheme}
                                    customStyle={{
                                        background: backgroundColor,
                                    }}
                                >
                                    {"npm install @uploadnest/client"}
                                </SyntaxHighlighter>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="mb-6">
                        <CardHeader>
                            <CardTitle>Quick Start</CardTitle>
                            <CardDescription>
                                Upload Files With Just a Few Lines Of Code.
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="overflow-hidden rounded-lg border">
                                <SyntaxHighlighter
                                    language="javascript"
                                    style={codeTheme}
                                    customStyle={{
                                        background: backgroundColor,
                                        padding: "1rem",
                                    }}
                                >
                                    {`import { UploadNestClient } from "@uploadnest/client";

const client = new UploadNestClient({
  apiKey: process.env.UPLOADNEST_API_KEY, // Your API key
});

// Upload files
const result = await client.uploadFiles(files);
console.log(result.files);`}
                                </SyntaxHighlighter>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="mb-6">
                        <CardHeader>
                            <CardTitle>Node.js Usage</CardTitle>
                            <CardDescription>
                                Upload From File Paths Or Buffers In Node.js
                                Applications.
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="overflow-hidden rounded-lg border">
                                <SyntaxHighlighter
                                    language="javascript"
                                    style={codeTheme}
                                    customStyle={{
                                        margin: 0,
                                        background: backgroundColor,
                                        padding: "1rem",
                                    }}
                                >
                                    {`import { UploadNestClient } from "@uploadnest/client";
import fs from "fs";

const client = new UploadNestClient({
  apiKey: process.env.UPLOADNEST_API_KEY,
});

// Upload from file path
await client.uploadFiles("/path/to/file.jpg");

// Multiple files
await client.uploadFiles(["/path/to/file1.jpg", "/path/to/file2.pdf"]);

// Upload buffer
const buffer = fs.readFileSync("image.jpg");
buffer.name = "image.jpg";
buffer.type = "image/jpeg";
await client.uploadFiles(buffer);`}
                                </SyntaxHighlighter>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="mb-6">
                        <CardHeader>
                            <CardTitle>Browser/React Usage</CardTitle>
                            <CardDescription>
                                Upload File Objects From File Inputs In The
                                Browser.
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="overflow-hidden rounded-lg border">
                                <SyntaxHighlighter
                                    language="javascript"
                                    style={codeTheme}
                                    customStyle={{
                                        margin: 0,
                                        background: backgroundColor,
                                        padding: "1rem",
                                    }}
                                >
                                    {`import { UploadNestClient } from "@uploadnest/client";

const client = new UploadNestClient({
  apiKey: "your-api-key",
  forceBrowser: true,
});

// From file input
const fileInput = document.querySelector('input[type="file"]');
await client.uploadFiles(fileInput.files[0]);

// Multiple files
await client.uploadFiles(Array.from(fileInput.files));

// In React component
function FileUpload() {
  const handleUpload = async (event) => {
    const files = event.target.files;
    const result = await client.uploadFiles(files[0]);
    console.log('Uploaded:', result.files);
  };

  return <input type="file" onChange={handleUpload} />;
}`}
                                </SyntaxHighlighter>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="mb-6">
                        <CardHeader>
                            <CardTitle>Next.js Server Actions</CardTitle>
                            <CardDescription>
                                Use With Next.js App Router Server Actions.
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="overflow-hidden rounded-lg border">
                                <SyntaxHighlighter
                                    language="javascript"
                                    style={codeTheme}
                                    customStyle={{
                                        margin: 0,
                                        background: backgroundColor,
                                        padding: "1rem",
                                    }}
                                >
                                    {`// app/upload/page.tsx
import { UploadNestClient } from "@uploadnest/client";

async function uploadAction(formData: FormData) {
  "use server";

  const client = new UploadNestClient({
    apiKey: process.env.UPLOADNEST_API_KEY!,
    forceBrowser: true,
  });

  const file = formData.get("file") as File;
  const result = await client.uploadFiles(file);

  return result;
}`}
                                </SyntaxHighlighter>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="mb-6">
                        <CardHeader>
                            <CardTitle>Error Handling</CardTitle>
                            <CardDescription>
                                Handle Different Types Of Upload Errors
                                Gracefully.
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="overflow-hidden rounded-lg border">
                                <SyntaxHighlighter
                                    language="javascript"
                                    style={codeTheme}
                                    customStyle={{
                                        margin: 0,
                                        background: backgroundColor,
                                        padding: "1rem",
                                    }}
                                >
                                    {`import { ValidationError, UploadError } from "@uploadnest/client/errors";

try {
  const result = await client.uploadFiles(files);
  console.log('Success:', result.files);
} catch (error) {
  if (error instanceof ValidationError) {
    console.log("Invalid file type:", error.message);
  } else if (error instanceof UploadError) {
    console.log("Upload failed:", error.message);
  } else {
    console.error("Unexpected error:", error);
  }
}`}
                                </SyntaxHighlighter>
                            </div>
                        </CardContent>
                    </Card>

                    <div className="bg-gray-50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-700 rounded-lg p-4 mb-6">
                        <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">
                            📦 Package Information
                        </h3>
                        <p className="text-sm text-gray-700 dark:text-gray-300 mb-2">
                            For Detailed Information On All Methods, Types, And
                            Advanced Usage, Visit The{" "}
                            <a
                                href="https://www.npmjs.com/package/@uploadnest/client"
                                className="underline font-medium text-primary hover:text-red-700 dark:hover:text-red-400"
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                @uploadnest/client Package On npm
                            </a>
                            .
                        </p>
                        <p className="text-xs text-gray-600 dark:text-gray-400">
                            Supports: Node.js 16+, Modern Browsers, Next.js 13+,
                            TypeScript 4.5+
                        </p>
                    </div>
                </div>

                <div>
                    <h2 className="text-lg font-bold mb-6">Direct API Usage</h2>
                    <Card>
                        <CardHeader>
                            <CardTitle>REST API</CardTitle>
                            <CardDescription>
                                Interact With The Uploadnest API Directly Using
                                Standard HTTP Requests If You Prefer Not To Use
                                The SDK.
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="overflow-hidden rounded-lg border">
                                <SyntaxHighlighter
                                    language="javascript"
                                    style={codeTheme}
                                    customStyle={{
                                        margin: 0,
                                        padding: "1rem",
                                        background: backgroundColor,
                                    }}
                                >
                                    {`async function uploadFileDirectly(apiKey, file) {
  const formData = new FormData();
  formData.append('files', file);
  
  try {
    const response = await fetch('${public_baseurl}/v1/files/upload', {
      method: 'POST',
      headers: {
        'Authorization': \`Bearer \${apiKey}\`
      },
      body: formData
    });
    
    if (!response.ok) {
      throw new Error(\`HTTP error! Status: \${response.status}\`);
    }
    
    const data = await response.json();
    console.log('Upload successful:', data);
    return data;
  } catch (error) {
    console.error('Error uploading file:', error);
    throw error;
  }
}

// Example Usage
// uploadFileDirectly('your-api-key', fileObject);`}
                                </SyntaxHighlighter>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </PageLayout>
    );
};

export default Docs;
