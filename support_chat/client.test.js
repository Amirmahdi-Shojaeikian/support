// const io = require('socket.io-client');

// // * test connection user
// // const socket = io('http://localhost:4003/auth/user'); 
// // socket.emit("message", {
// // message : "test"
// // });

// // * test connection support
// // const socket = io('http://localhost:4003/auth/support'); 
// // socket.emit("message", {
// // message : "test"
// // });



// // *create user
// // const socket = io('http://localhost:4003/user'); 
// // socket.emit("joinSupportChat", {
// //   name: "امیرمهدی",
// //   topic: "پیگیری سفارش",
// //   email:"amir@gmail.com",
// //   phonNumber:"09123456987"
// // });

// // socket.on('previousMessages', (messages) => {
// //   console.log('Previous messages:', messages);
// // });

// //* test send and receive message


// // اتصال به سرور Socket.IO
// // const socket = io('http://localhost:4003/pvs'); 
// // socket.on('connect', () => {
// //   console.log('Connected to server with ID:', socket.id);

// //   // ارسال درخواست برای پیوستن به اتاق پشتیبانی
// //   socket.emit('joinUser', {
// //     name: 'John Doe',
// //     topic: 'Need help with my order',
// //     email: 'johndoe@example.com',
// //     phoneNumber: '123-456-7890'
// //   });
// //   console.log("ok!");
  

// //   // ارسال پیام از سمت کاربر به پشتیبانی
// //   socket.emit('userMessage', {
// //     userId: '511bb831-4dab-4ea9-bb76-1e4b4e3416e3',  
// //     message: 'Hello, I need help with my order'
// //   });
// //   // گوش دادن به پیام‌های پشتیبان
// //   socket.on('messageFromSupport', (data) => {
// //     console.log('Message from support:', data.message);
// //   });
  
// //   // دریافت پیام‌های قبلی
// //   socket.on('previousMessages', (messages) => {
// //     console.log('Previous messages:', messages);
// //   });
  
// //   // تست دریافت پیام از سمت کاربر
// //   socket.on('messageFromUser', (data) => {
// //     console.log('Message from user:', data);
// //   });
// // });







// // const io = require("socket.io-client");

// describe("Socket.IO Chat Tests", () => {
//   let clientSocket;

//   beforeAll((done) => {
//     // اتصال کلاینت به سرور تست با پورت 4003
//     clientSocket = io("http://localhost:4003/pvs/user");
//     clientSocket.on("connect", done);
//   });

//   afterAll(() => {
//     // قطع اتصال کلاینت پس از پایان تست‌ها
//     clientSocket.close();
//   });

//   test("Should join user to a chat room", (done) => {
//     const roomId = "e48a85d9-b680-4d6f-8a41-2b888e3586bc";

//     // شبیه‌سازی ارسال داده برای پیوستن به اتاق
//     clientSocket.emit("joinUser", { data: { roomId } });

//     // انتظار برای دریافت اطلاعات تاییدیه
//     clientSocket.on("joined", (data) => {
//       expect(data).toEqual({ roomId });
//       done();
//     });
//   });

//   test("Should send and confirm new message", (done) => {
//     const roomId = "e48a85d9-b680-4d6f-8a41-2b888e3586bc";
//     const message = "Hello from test";

//     // ارسال پیام جدید
//     clientSocket.emit("newMsg", { data: { roomId, message } });

//     // دریافت پیام تایید شده
//     clientSocket.on("confirmMsg", (data) => {
//       expect(data).toEqual({ roomId, message });
//       done();
//     });
//   });
// });


// const { io } = require("socket.io-client");

// describe("Socket.IO Chat Tests", () => {
//   let userSocket, supportSocket;

//   afterAll(() => {
//     // بستن سوکت‌ها بعد از اتمام تست‌ها
//     if (userSocket) userSocket.close();
//     if (supportSocket) supportSocket.close();
//   });

//   test("User sends a message and it is received by support", (done) => {
//     // اتصال کاربر به فضای /pvs/user
//     userSocket = io("http://localhost:4003/pvs/user");

//     userSocket.on("connect", () => {
//       console.log("User socket connected");
//       userSocket.emit("joinUser", { data: { roomId: "e48a85d9-b680-4d6f-8a41-2b888e3586bc" } });

//       // اتصال پشتیبان به فضای /pvs/support
//       supportSocket = io("http://localhost:4003/pvs/support");

//       supportSocket.on("connect", () => {
//         console.log("Support socket connected");
//         supportSocket.emit("joinSupport", { roomId: "e48a85d9-b680-4d6f-8a41-2b888e3586bc" });

//         // شنیدن پیام تأیید در پشتیبان
//         supportSocket.on("supportMsg", (message) => {
//           console.log("Received message from user:", message);
//           expect(message).toHaveProperty("sender", "USER");
//           expect(message).toHaveProperty("message", "Hello from user!");

//           // پایان تست
//           done();
//         });

//         // ارسال پیام از طرف کاربر
//         userSocket.emit("newMsg", {
//           data: { roomId: "e48a85d9-b680-4d6f-8a41-2b888e3586bc", message: "Hello from user!" },
//         });
//       });
//     });
//   }, 10000); // افزایش تایم‌اوت به 10000 میلی‌ثانیه (10 ثانیه)
// });


const fs = require("fs");
const { io } = require("socket.io-client");

// اتصال به فضای نام `/pvs/user` در سرور روی پورت 4003
const socket = io("http://localhost:4003/pvs/user");

// شناسه اتاق و اطلاعات پیام برای تست
const roomId = "e48a85d9-b680-4d6f-8a41-2b888e3586bc";
const testMessage = "Hello, this is a test message!";
const filePath = "./image13.png"; // فایل تست برای آپلود

socket.on("connect", () => {
  console.log("اتصال به سرور برقرار شد:", socket.id);

  // پیوستن به اتاق با ارسال رویداد `joinUser`
  socket.emit("joinUser", { data: { roomId } });

  // زمانی که پیام `joined` دریافت شد، لیست پیام‌های قبلی چاپ می‌شود
  socket.on("joined", (messages) => {
    console.log("پیام‌های قبلی:", messages);

    // ارسال پیام متنی جدید به اتاق
    sendTextMessage();

    // ارسال فایل به اتاق
    sendFileMessage();
  });
});

// تابع برای ارسال پیام متنی
function sendTextMessage() {
  const messageData = {
    roomId,
    type: "TEXT",
    message: testMessage,
  };

  socket.emit("newMsg", { data: messageData });
}

// تابع برای ارسال فایل
function sendFileMessage() {
  fs.readFile(filePath, (err, fileBuffer) => {
    if (err) {
      console.error("خطا در خواندن فایل:", err);
      return;
    }

    const messageData = {
      roomId,
      type: "FILE",
      file: fileBuffer,
      filename: "image13.png",
    };

    socket.emit("newMsg", { data: messageData });
  });
}

// نمایش وضعیت پیام‌های جدید دریافتی
socket.on("userMsg", (msg) => {
  console.log("پیام جدید برای کاربر:", msg);
});

socket.on("supportMsg", (msg) => {
  console.log("پیام جدید برای پشتیبان:", msg);
});

// مدیریت خطاها
socket.on("connect_error", (err) => {
  console.error("خطا در اتصال به سرور:", err.message);
});
