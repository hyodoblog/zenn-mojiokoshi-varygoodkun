import { MessageEvent } from '@line/bot-sdk'
import { gcloudVision } from '~/utils/gcloud'
import { getMessageContent, lineClient, makeReplyMessage } from '~/utils/line'
import { errorLogger } from '~/utils/util'
import { msgNotText } from '~line/notice-messages/other'

// *********
// main関数
// *********

export const messageImageHandler = async (event: MessageEvent): Promise<void> => {
  try {
    const { id: messageId } = event.message

    const buffer = await getMessageContent(messageId)
    let text = await gcloudVision(buffer)

    if (text === null) {
      await lineClient.replyMessage(event.replyToken, msgNotText)
    } else {
      text = text.substring(0, 5000)
      await lineClient.replyMessage(event.replyToken, makeReplyMessage(text))
    }
  } catch (err) {
    errorLogger(err)
    throw new Error('message image handler')
  }
}
