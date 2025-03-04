"use client";
import { useState } from "react";

export default function AssistantChat() {
    const [file, setFile] = useState<File | null>(null);
    const [status, setStatus] = useState<string | null>(null);
    const [threadId, setThreadId] = useState<string | null>(null);
    const [runId, setRunId] = useState<string | null>(null);
    const [messages, setMessages] = useState<{ role: string; content: string }[]>([]);

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files?.[0]) {
            setFile(event.target.files[0]);
        }
    };

    const handleUpload = async () => {
        if (!file) {
            setStatus("Please select a file first.");
            return;
        }

        setStatus("Uploading...");

        const formData = new FormData();
        formData.append("file", file);

        try {
            const response = await fetch("/api/openai", {
                method: "POST",
                body: formData,
            });

            const result = await response.json();
            setStatus(result.message);
        } catch (error) {
            console.error("Upload error:", error);
            setStatus("Error uploading file.");
        }
    };

    const pollForResponse = async (threadId: string, runId: string) => {
        setStatus("Waiting for assistant's response...");

        const checkResponse = async () => {
            try {
                const response = await fetch(`/api/check-response?threadId=${threadId}&runId=${runId}`);
                const result = await response.json();

                if (result.status === "completed") {
                    setMessages(result.messages);
                    setStatus("Response received!");
                } else {
                    setTimeout(checkResponse, 3000); // Poll every 3 seconds
                }
            } catch (error) {
                console.error("Error checking response:", error);
                setStatus("Error fetching response.");
            }
        };

        checkResponse();
    };

    return (
        <div>
            <input type="file" accept="application/pdf" onChange={handleFileChange} />
            <button onClick={handleUpload}>Upload & Send PDF</button>
            <p>{status}</p>
            <div>
                {messages.length > 0 && (
                    <div>
                        <h3>Assistant Response:</h3>
                        {messages.map((msg, index) => (
                            <p key={index}>
                                <strong>{msg.role === "assistant" ? "Assistant" : "You"}:</strong> {msg.content}
                            </p>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}