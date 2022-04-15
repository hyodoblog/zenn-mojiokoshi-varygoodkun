import { MessageEvent } from '@line/bot-sdk'
import { lineClient, makeReplyMessage } from '~/utils/line'
import { errorLogger } from '~/utils/util'

// *********
// main関数
// *********

export const messageImageHandler = async (event: MessageEvent): Promise<void> => {
  try {
    const { id: messageId } = event.message

    await lineClient.replyMessage(event.replyToken, makeReplyMessage(messageId))
  } catch (err) {
    errorLogger(err)
    throw new Error('message image handler')
  }
}
