// "use client";
// import React, { FormEvent, useState } from "react";

// interface MessageProps {
//   role: "user" | "assistant";
//   content: string;
// }

// export default function FormChat() {
//   const [question, setQuestion] = useState("");
//   const [messages, setMessages] = useState<MessageProps[]>([]);

//   const handleSubmit = async (event: FormEvent) => {
//     event.preventDefault();

//     if (!question.trim()) return;

//     const newMessages = [
//       ...messages,
//       { role: "user" as "user" | "assistant", content: question },
//     ];
//     setMessages(newMessages);
//     setQuestion("");

//     setMessages((prevMessages) => [
//       ...prevMessages,
//       { role: "assistant", content: "Loading..." },
//     ]);

//     try {
//       const res = await fetch("http://localhost:5000/ask", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({
//           actualQuestion: question,
//           oldContent: newMessages,
//         }),
//       });

//       const data = await res.json();

//       const formattedResponse = data.response
//         .replace(/###/g, "<br/><strong>")
//         .replace(/\*\*/g, "</strong>")
//         .replace(/\n/g, "<br/>")
//         .replace(/\\\[/g, "<br/><strong>")
//         .replace(/\\\]/g, "</strong>")
//         .replace(/\(N/g, "<strong>(N")
//         .replace(/\)/g, ")</strong>");

//       setMessages((prevMessages) =>
//         prevMessages.map((msg, index) =>
//           index === prevMessages.length - 1
//             ? { ...msg, content: formattedResponse }
//             : msg
//         )
//       );
//     } catch (error) {
//       setMessages((prevMessages) =>
//         prevMessages.map((msg, index) =>
//           index === prevMessages.length - 1
//             ? { ...msg, content: "An error occurred. Please try again." }
//             : msg
//         )
//       );
//     }
//   };

//   return (
//     <div>
//       <div className="space-y-4 overflow-y-auto h-full">
//         {messages.map((message, index) => (
//           <div
//             key={index}
//             className={`flex ${
//               message.role === "user" ? "justify-end" : "justify-start"
//             }`}
//           >
//             <div
//               className={`p-4 rounded-lg max-w-xl whitespace-pre-wrap ${
//                 message.role === "user"
//                   ? "bg-blue-300 text-black"
//                   : "bg-[#FEB47B] text-black"
//               }`}
//               dangerouslySetInnerHTML={{ __html: message.content }}
//             />
//           </div>
//         ))}
//       </div>
//       <form
//         onSubmit={handleSubmit}
//         onKeyDown={(e) => e.key === "Enter" && handleSubmit(e)}
//         className="flex flex-col space-y-4"
//       >
//         <textarea
//           value={question}
//           onChange={(e) => setQuestion(e.target.value)}
//           className="mt-5 p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 bg-[#F7EAD9] focus:ring-[#FF7E5F] text-black" // Use #FF7E5F for the focus ring
//           rows={4}
//           placeholder="Enter your question..."
//         />
//         <button
//           type="submit"
//           className="bg-[#FF7E5F] text-grey-300 py-2 rounded-lg hover:bg-[#FF9066]" // Button with #FF7E5F background and hover effect
//         >
//           Ask
//         </button>
//       </form>
//     </div>
//   );
// }
