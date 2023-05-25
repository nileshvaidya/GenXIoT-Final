import TelegramBot from 'node-telegram-bot-api';

const apiToken = '6279777851:AAG0UO6-iRmt5JZTvuwbgd82pP3hVQQMmuU';
const bot = new TelegramBot(apiToken, { polling: false });

let msg = '';

interface Client {
  name: string;
  phone: string;
  chatId: number;
}
const clients: Client[] = [
  // {
  //   name: 'Nilesh',
  //   phone: '+91887575913',
  //   chatId: 408339003,
  // },
  // {
  //   name: 'Sandip',
  //   phone: '+9987585914',
  //   chatId: 375871884,
  // },
  {
    name: 'Nikhil',
    phone: '+919833012272',
    chatId: 394709538,
  }
];



export const sendTelegramMsg: any = (sendTo: string,paramType: string, param:string, msgType: string, val: number, type : string, limit : number) => {
 
  console.log("sendTo : ", sendTo , "   " ,'paramType : ', paramType, '   ' , 'param : ', param , '   ', 'msgType : ', msgType, '   ', 'type : ', type );
  
  if (msgType == 'alerts') {
    if (paramType == 'analog') {
      if (type == 'high') {
        msg = `💣 *ALERTS* 💣 --- Param ${param} 's Value : ${val} is above the Higher Limit of ${limit}. Kindly take appropriate action immediately.* 🔥 🔥 🔥`;

      }
      if (type == 'low') {
        msg = `💣 *ALERTS* 💣 --- Param ${param} 's Value : ${val} is below the Lower Limit of ${limit}. Kindly take appropriate action immediately.* 🔥 🔥 🔥`;

      }
    }
    if (paramType == 'digital') {
      if (type == 'high') {
        msg = `💣 *ALERTS* 💣 --- Param ${param} 's Value *HIGH* which is *critical according to settings. Kindly take appropriate action immediately.* 🔥 🔥 🔥`;

      }
      if (type == 'low') {
        msg = `💣 *ALERTS* 💣 --- Param ${param} 's Value *LOW* which is *critical according to settings. Kindly take appropriate action immediately.* 🔥 🔥 🔥`;

      }
    }


    }
  if (msgType == 'alarms') {
    if (paramType == 'analog') {
      if (type == 'high') {
        msg = `⏰ *ALARM* ⏰ --- Param ${param} 's Value : ${val} is above the Higher Limit of ${limit}. Kindly take appropriate action immediately.* 🚀 🚀 🚀`;

      }
      if (type == 'low') {
        msg = `⏰ *ALARM* ⏰ --- Param ${param} 's Value : ${val} is below the Lower Limit of ${limit}. Kindly take appropriate action immediately.* 🚀 🚀 🚀`;

      }
    }
    if (paramType == 'digital') {
      if (type == 'high') {
        msg = `⏰ *ALARM* ⏰ --- Param ${param} 's Value *HIGH* which is *critical according to settings. Kindly take appropriate action immediately.* 🚀 🚀 🚀`;

      }
      if (type == 'low') {
        msg = `⏰ *ALARM* ⏰ --- Param ${param} 's Value *LOW* which is *critical according to settings. Kindly take appropriate action immediately.* 🚀 🚀 🚀`;

      }
    }


  }
  
  if (!msg) {
    msg = "*Some param missing!!!*"
  }
  console.log(msg);
  sendAlerts(msg);
  }
  async function sendAlerts(message: string) {
    for (const client of clients) {
      try {
        const sentMessage = await bot.sendMessage(client.chatId, message);
        console.log(`Alert sent to client ${client.name}: ${sentMessage.text}`);
      } catch (err: any) {
        console.error(`Error sending alert to client ${client.name}: ${err.message}`);
      }
    }
  }
