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
      imageUri
      createdAt
      updatedAt
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
      imageUri
      createdAt
      updatedAt
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
      imageUri
      createdAt
      updatedAt
    }
  }
`;
export const createUserChat = /* GraphQL */ `
  mutation CreateUserChat(
    $input: CreateUserChatInput!
    $condition: ModelUserChatConditionInput
  ) {
    createUserChat(input: $input, condition: $condition) {
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
export const updateUserChat = /* GraphQL */ `
  mutation UpdateUserChat(
    $input: UpdateUserChatInput!
    $condition: ModelUserChatConditionInput
  ) {
    updateUserChat(input: $input, condition: $condition) {
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
export const deleteUserChat = /* GraphQL */ `
  mutation DeleteUserChat(
    $input: DeleteUserChatInput!
    $condition: ModelUserChatConditionInput
  ) {
    deleteUserChat(input: $input, condition: $condition) {
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
export const createSentMsg = /* GraphQL */ `
  mutation CreateSentMsg(
    $input: CreateSentMsgInput!
    $condition: ModelSentMsgConditionInput
  ) {
    createSentMsg(input: $input, condition: $condition) {
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
export const updateSentMsg = /* GraphQL */ `
  mutation UpdateSentMsg(
    $input: UpdateSentMsgInput!
    $condition: ModelSentMsgConditionInput
  ) {
    updateSentMsg(input: $input, condition: $condition) {
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
export const deleteSentMsg = /* GraphQL */ `
  mutation DeleteSentMsg(
    $input: DeleteSentMsgInput!
    $condition: ModelSentMsgConditionInput
  ) {
    deleteSentMsg(input: $input, condition: $condition) {
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
