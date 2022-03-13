/* tslint:disable */
/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const onCreateMsgUser = /* GraphQL */ `
  subscription OnCreateMsgUser {
    onCreateMsgUser {
      id
      name
      imageUri
      updatedAt
      createdAt
    }
  }
`;
export const onUpdateMsgUser = /* GraphQL */ `
  subscription OnUpdateMsgUser {
    onUpdateMsgUser {
      id
      name
      imageUri
      updatedAt
      createdAt
    }
  }
`;
export const onDeleteMsgUser = /* GraphQL */ `
  subscription OnDeleteMsgUser {
    onDeleteMsgUser {
      id
      name
      imageUri
      updatedAt
      createdAt
    }
  }
`;
export const onCreateUserChat = /* GraphQL */ `
  subscription OnCreateUserChat {
    onCreateUserChat {
      id
      firstUser {
        id
        name
        imageUri
        updatedAt
        createdAt
      }
      secondUser {
        id
        name
        imageUri
        updatedAt
        createdAt
      }
      lastMsg
      mod
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
      updatedAt
      status
      createdAt
      userChatFirstUserId
      userChatSecondUserId
    }
  }
`;
export const onUpdateUserChat = /* GraphQL */ `
  subscription OnUpdateUserChat {
    onUpdateUserChat {
      id
      firstUser {
        id
        name
        imageUri
        updatedAt
        createdAt
      }
      secondUser {
        id
        name
        imageUri
        updatedAt
        createdAt
      }
      lastMsg
      mod
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
      updatedAt
      status
      createdAt
      userChatFirstUserId
      userChatSecondUserId
    }
  }
`;
export const onDeleteUserChat = /* GraphQL */ `
  subscription OnDeleteUserChat {
    onDeleteUserChat {
      id
      firstUser {
        id
        name
        imageUri
        updatedAt
        createdAt
      }
      secondUser {
        id
        name
        imageUri
        updatedAt
        createdAt
      }
      lastMsg
      mod
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
      updatedAt
      status
      createdAt
      userChatFirstUserId
      userChatSecondUserId
    }
  }
`;
export const onCreateSentMsg = /* GraphQL */ `
  subscription OnCreateSentMsg {
    onCreateSentMsg {
      id
      chat {
        id
        firstUser {
          id
          name
          imageUri
          updatedAt
          createdAt
        }
        secondUser {
          id
          name
          imageUri
          updatedAt
          createdAt
        }
        lastMsg
        mod
        messages {
          nextToken
        }
        updatedAt
        status
        createdAt
        userChatFirstUserId
        userChatSecondUserId
      }
      sender {
        id
        name
        imageUri
        updatedAt
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
export const onUpdateSentMsg = /* GraphQL */ `
  subscription OnUpdateSentMsg {
    onUpdateSentMsg {
      id
      chat {
        id
        firstUser {
          id
          name
          imageUri
          updatedAt
          createdAt
        }
        secondUser {
          id
          name
          imageUri
          updatedAt
          createdAt
        }
        lastMsg
        mod
        messages {
          nextToken
        }
        updatedAt
        status
        createdAt
        userChatFirstUserId
        userChatSecondUserId
      }
      sender {
        id
        name
        imageUri
        updatedAt
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
export const onDeleteSentMsg = /* GraphQL */ `
  subscription OnDeleteSentMsg {
    onDeleteSentMsg {
      id
      chat {
        id
        firstUser {
          id
          name
          imageUri
          updatedAt
          createdAt
        }
        secondUser {
          id
          name
          imageUri
          updatedAt
          createdAt
        }
        lastMsg
        mod
        messages {
          nextToken
        }
        updatedAt
        status
        createdAt
        userChatFirstUserId
        userChatSecondUserId
      }
      sender {
        id
        name
        imageUri
        updatedAt
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
