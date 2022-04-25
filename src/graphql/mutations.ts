/* tslint:disable */
/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const createMsgUser = /* GraphQL */ `
  mutation CreateMsgUser(
    $input: CreateMsgUserInput!
    $condition: ModelMsgUserConditionInput
  ) {
    createMsgUser(input: $input, condition: $condition) {
      id
      name
      updatedAt
      pushToken
      createdAt
    }
  }
`;
export const updateMsgUser = /* GraphQL */ `
  mutation UpdateMsgUser(
    $input: UpdateMsgUserInput!
    $condition: ModelMsgUserConditionInput
  ) {
    updateMsgUser(input: $input, condition: $condition) {
      id
      name
      updatedAt
      pushToken
      createdAt
    }
  }
`;
export const deleteMsgUser = /* GraphQL */ `
  mutation DeleteMsgUser(
    $input: DeleteMsgUserInput!
    $condition: ModelMsgUserConditionInput
  ) {
    deleteMsgUser(input: $input, condition: $condition) {
      id
      name
      updatedAt
      pushToken
      createdAt
    }
  }
`;
export const createUserChat = /* GraphQL */ `
  mutation CreateUserChat(
    $input: CreateUserChatInput!
    $condition: ModelUserChatConditionInput
  ) {
    createUserChat(input: $input, condition: $condition) {
      id
      firstUser {
        id
        name
        updatedAt
        pushToken
        createdAt
      }
      secondUser {
        id
        name
        updatedAt
        pushToken
        createdAt
      }
      lastMsg
      lastMsgSender
      unreadMsg
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
export const updateUserChat = /* GraphQL */ `
  mutation UpdateUserChat(
    $input: UpdateUserChatInput!
    $condition: ModelUserChatConditionInput
  ) {
    updateUserChat(input: $input, condition: $condition) {
      id
      firstUser {
        id
        name
        updatedAt
        pushToken
        createdAt
      }
      secondUser {
        id
        name
        updatedAt
        pushToken
        createdAt
      }
      lastMsg
      lastMsgSender
      unreadMsg
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
export const deleteUserChat = /* GraphQL */ `
  mutation DeleteUserChat(
    $input: DeleteUserChatInput!
    $condition: ModelUserChatConditionInput
  ) {
    deleteUserChat(input: $input, condition: $condition) {
      id
      firstUser {
        id
        name
        updatedAt
        pushToken
        createdAt
      }
      secondUser {
        id
        name
        updatedAt
        pushToken
        createdAt
      }
      lastMsg
      lastMsgSender
      unreadMsg
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
export const createSentMsg = /* GraphQL */ `
  mutation CreateSentMsg(
    $input: CreateSentMsgInput!
    $condition: ModelSentMsgConditionInput
  ) {
    createSentMsg(input: $input, condition: $condition) {
      id
      chat {
        id
        firstUser {
          id
          name
          updatedAt
          pushToken
          createdAt
        }
        secondUser {
          id
          name
          updatedAt
          pushToken
          createdAt
        }
        lastMsg
        lastMsgSender
        unreadMsg
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
export const updateSentMsg = /* GraphQL */ `
  mutation UpdateSentMsg(
    $input: UpdateSentMsgInput!
    $condition: ModelSentMsgConditionInput
  ) {
    updateSentMsg(input: $input, condition: $condition) {
      id
      chat {
        id
        firstUser {
          id
          name
          updatedAt
          pushToken
          createdAt
        }
        secondUser {
          id
          name
          updatedAt
          pushToken
          createdAt
        }
        lastMsg
        lastMsgSender
        unreadMsg
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
export const deleteSentMsg = /* GraphQL */ `
  mutation DeleteSentMsg(
    $input: DeleteSentMsgInput!
    $condition: ModelSentMsgConditionInput
  ) {
    deleteSentMsg(input: $input, condition: $condition) {
      id
      chat {
        id
        firstUser {
          id
          name
          updatedAt
          pushToken
          createdAt
        }
        secondUser {
          id
          name
          updatedAt
          pushToken
          createdAt
        }
        lastMsg
        lastMsgSender
        unreadMsg
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
