import { Client, ClientConfig, Message, MiddlewareConfig } from '@line/bot-sdk'
import { logger } from 'firebase-functions'
import { LINE_MESSAGING_CHANNEL_ACCESS_TOKEN, LINE_MESSAGING_CHANNEL_SECRET } from './secrets'

export const lineMiddlewareConfig: MiddlewareConfig = {
  channelSecret: LINE_MESSAGING_CHANNEL_SECRET
}

export const lineConfig: ClientConfig = {
  ...lineMiddlewareConfig,
  channelAccessToken: LINE_MESSAGING_CHANNEL_ACCESS_TOKEN
}

export const lineClient = new Client(lineConfig)

export const getMessageContent = (messageId: string): Promise<Buffer> => {
  return new Promise((resolve, reject) =>
    lineClient
      .getMessageContent(messageId)
      .then((stream) => {
        const content: Buffer[] = []
        stream.on('data', (chunk) => content.push(Buffer.from(chunk)))
        stream.on('end', () => resolve(Buffer.concat(content)))
        stream.on('error', (err) => {
          logger.error(err)
          reject('lineGetContent')
        })
      })
      .catch((err) => {
        logger.error(err)
        reject('lineGetContent')
      })
  )
}

export const makeReplyMessage = (text: string): Message => {
  return {
    type: 'text',
    text: text.replace(/<br>/g, '\n')
  }
}
