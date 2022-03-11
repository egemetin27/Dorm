/* tslint:disable */
/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const getMsgUser = /* GraphQL */ `
  query GetMsgUser($id: ID!) {
    getMsgUser(id: $id) {
      id
      name
      imageUri
      createdAt
      updatedAt
    }
  }
`;
export const listMsgUsers = /* GraphQL */ `
  query ListMsgUsers(
    $filter: ModelMsgUserFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listMsgUsers(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        name
        imageUri
        createdAt
        updatedAt
      }
      nextToken
    }
  }
`;
export const getUserChat = /* GraphQL */ `
  query GetUserChat($id: ID!) {
    getUserChat(id: $id) {
      firstUser {
        id
        name
        imageUri
        createdAt
        updatedAt
      }
      secondUser {
        id
        name
        imageUri
        createdAt
        updatedAt
      }
      lastMsg
      mode
      massages {
        items {
          id
          text
          createdAt
          updatedAt
          userChatMassagesId
          sentMsgSenderId
        }
        nextToken
      }
      id
      createdAt
      updatedAt
      userChatFirstUserId
      userChatSecondUserId
    }
  }
`;
export const listUserChats = /* GraphQL */ `
  query ListUserChats(
    $filter: ModelUserChatFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listUserChats(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        firstUser {
          id
          name
          imageUri
          createdAt
          updatedAt
        }
        secondUser {
          id
          name
          imageUri
          createdAt
          updatedAt
        }
        lastMsg
        mode
        massages {
          nextToken
        }
        id
        createdAt
        updatedAt
        userChatFirstUserId
        userChatSecondUserId
      }
      nextToken
    }
  }
`;
export const getSentMsg = /* GraphQL */ `
  query GetSentMsg($id: ID!) {
    getSentMsg(id: $id) {
      id
      sender {
        id
        name
        imageUri
        createdAt
        updatedAt
      }
      text
      createdAt
      updatedAt
      userChatMassagesId
      sentMsgSenderId
    }
  }
`;
export const listSentMsgs = /* GraphQL */ `
  query ListSentMsgs(
    $filter: ModelSentMsgFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listSentMsgs(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        sender {
          id
          name
          imageUri
          createdAt
          updatedAt
        }
        text
        createdAt
        updatedAt
        userChatMassagesId
        sentMsgSenderId
      }
      nextToken
    }
  }
`;
