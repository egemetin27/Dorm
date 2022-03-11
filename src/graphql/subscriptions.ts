/* tslint:disable */
/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const onCreateMsgUser = /* GraphQL */ `
  subscription OnCreateMsgUser {
    onCreateMsgUser {
      id
      name
      imageUri
      createdAt
      updatedAt
    }
  }
`;
export const onUpdateMsgUser = /* GraphQL */ `
  subscription OnUpdateMsgUser {
    onUpdateMsgUser {
      id
      name
      imageUri
      createdAt
      updatedAt
    }
  }
`;
export const onDeleteMsgUser = /* GraphQL */ `
  subscription OnDeleteMsgUser {
    onDeleteMsgUser {
      id
      name
      imageUri
      createdAt
      updatedAt
    }
  }
`;
export const onCreateUserChat = /* GraphQL */ `
  subscription OnCreateUserChat {
    onCreateUserChat {
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
export const onUpdateUserChat = /* GraphQL */ `
  subscription OnUpdateUserChat {
    onUpdateUserChat {
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
export const onDeleteUserChat = /* GraphQL */ `
  subscription OnDeleteUserChat {
    onDeleteUserChat {
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
export const onCreateSentMsg = /* GraphQL */ `
  subscription OnCreateSentMsg {
    onCreateSentMsg {
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
export const onUpdateSentMsg = /* GraphQL */ `
  subscription OnUpdateSentMsg {
    onUpdateSentMsg {
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
export const onDeleteSentMsg = /* GraphQL */ `
  subscription OnDeleteSentMsg {
    onDeleteSentMsg {
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
