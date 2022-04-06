/* tslint:disable */
/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const onCreateMsgUser = /* GraphQL */ `
  subscription OnCreateMsgUser {
    onCreateMsgUser {
      id
      name
      updatedAt
      pushToken
      createdAt
    }
  }
`;
export const onUpdateMsgUser = /* GraphQL */ `
  subscription OnUpdateMsgUser {
    onUpdateMsgUser {
      id
      name
      updatedAt
      pushToken
      createdAt
    }
  }
`;
export const onDeleteMsgUser = /* GraphQL */ `
  subscription OnDeleteMsgUser {
    onDeleteMsgUser {
      id
      name
      updatedAt
      pushToken
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
export const onUpdateUserChat = /* GraphQL */ `
  subscription OnUpdateUserChat {
    onUpdateUserChat {
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
export const onDeleteUserChat = /* GraphQL */ `
  subscription OnDeleteUserChat {
    onDeleteUserChat {
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
export const onCreateSentMsg = /* GraphQL */ `
  subscription OnCreateSentMsg {
    onCreateSentMsg {
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
export const onUpdateSentMsg = /* GraphQL */ `
  subscription OnUpdateSentMsg {
    onUpdateSentMsg {
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
export const onDeleteSentMsg = /* GraphQL */ `
  subscription OnDeleteSentMsg {
    onDeleteSentMsg {
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
