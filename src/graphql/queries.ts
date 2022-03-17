/* tslint:disable */
/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const getMsgUser = /* GraphQL */ `
  query GetMsgUser($id: ID!) {
    getMsgUser(id: $id) {
      id
      name
      imageUri
      updatedAt
      pushToken
      createdAt
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
        updatedAt
        pushToken
        createdAt
      }
      nextToken
    }
  }
`;
export const getUserChat = /* GraphQL */ `
  query GetUserChat($id: ID!) {
    getUserChat(id: $id) {
      id
      firstUser {
        id
        name
        imageUri
        updatedAt
        pushToken
        createdAt
      }
      secondUser {
        id
        name
        imageUri
        updatedAt
        pushToken
        createdAt
      }
      lastMsg
      messages {
        items {
          id
          text
          updatedAt
          status
          createdAt
          userChatMessagesId
          sentMsgChatId
          sentMsgSenderId
        }
        nextToken
      }
      mod
      updatedAt
      createdAt
      status
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
        id
        firstUser {
          id
          name
          imageUri
          updatedAt
          pushToken
          createdAt
        }
        secondUser {
          id
          name
          imageUri
          updatedAt
          pushToken
          createdAt
        }
        lastMsg
        messages {
          nextToken
        }
        mod
        updatedAt
        createdAt
        status
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
      chat {
        id
        firstUser {
          id
          name
          imageUri
          updatedAt
          pushToken
          createdAt
        }
        secondUser {
          id
          name
          imageUri
          updatedAt
          pushToken
          createdAt
        }
        lastMsg
        messages {
          nextToken
        }
        mod
        updatedAt
        createdAt
        status
        userChatFirstUserId
        userChatSecondUserId
      }
      sender {
        id
        name
        imageUri
        updatedAt
        pushToken
        createdAt
      }
      text
      updatedAt
      status
      createdAt
      userChatMessagesId
      sentMsgChatId
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
        chat {
          id
          lastMsg
          mod
          updatedAt
          createdAt
          status
          userChatFirstUserId
          userChatSecondUserId
        }
        sender {
          id
          name
          imageUri
          updatedAt
          pushToken
          createdAt
        }
        text
        updatedAt
        status
        createdAt
        userChatMessagesId
        sentMsgChatId
        sentMsgSenderId
      }
      nextToken
    }
  }
`;
export const chatByDate = /* GraphQL */ `
  query ChatByDate(
    $status: String!
    $updatedAt: ModelStringKeyConditionInput
    $sortDirection: ModelSortDirection
    $filter: ModelUserChatFilterInput
    $limit: Int
    $nextToken: String
  ) {
    chatByDate(
      status: $status
      updatedAt: $updatedAt
      sortDirection: $sortDirection
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
        id
        firstUser {
          id
          name
          imageUri
          updatedAt
          pushToken
          createdAt
        }
        secondUser {
          id
          name
          imageUri
          updatedAt
          pushToken
          createdAt
        }
        lastMsg
        messages {
          nextToken
        }
        mod
        updatedAt
        createdAt
        status
        userChatFirstUserId
        userChatSecondUserId
      }
      nextToken
    }
  }
`;
export const msgByDate = /* GraphQL */ `
  query MsgByDate(
    $status: String!
    $updatedAt: ModelStringKeyConditionInput
    $sortDirection: ModelSortDirection
    $filter: ModelSentMsgFilterInput
    $limit: Int
    $nextToken: String
  ) {
    msgByDate(
      status: $status
      updatedAt: $updatedAt
      sortDirection: $sortDirection
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
        id
        chat {
          id
          lastMsg
          mod
          updatedAt
          createdAt
          status
          userChatFirstUserId
          userChatSecondUserId
        }
        sender {
          id
          name
          imageUri
          updatedAt
          pushToken
          createdAt
        }
        text
        updatedAt
        status
        createdAt
        userChatMessagesId
        sentMsgChatId
        sentMsgSenderId
      }
      nextToken
    }
  }
`;
