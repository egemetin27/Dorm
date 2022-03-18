/* tslint:disable */
/* eslint-disable */
//  This file was automatically generated and should not be edited.

export type CreateMsgUserInput = {
  id?: string | null,
  name: string,
  updatedAt?: string | null,
  pushToken?: string | null,
};

export type ModelMsgUserConditionInput = {
  name?: ModelStringInput | null,
  updatedAt?: ModelStringInput | null,
  pushToken?: ModelStringInput | null,
  and?: Array< ModelMsgUserConditionInput | null > | null,
  or?: Array< ModelMsgUserConditionInput | null > | null,
  not?: ModelMsgUserConditionInput | null,
};

export type ModelStringInput = {
  ne?: string | null,
  eq?: string | null,
  le?: string | null,
  lt?: string | null,
  ge?: string | null,
  gt?: string | null,
  contains?: string | null,
  notContains?: string | null,
  between?: Array< string | null > | null,
  beginsWith?: string | null,
  attributeExists?: boolean | null,
  attributeType?: ModelAttributeTypes | null,
  size?: ModelSizeInput | null,
};

export enum ModelAttributeTypes {
  binary = "binary",
  binarySet = "binarySet",
  bool = "bool",
  list = "list",
  map = "map",
  number = "number",
  numberSet = "numberSet",
  string = "string",
  stringSet = "stringSet",
  _null = "_null",
}


export type ModelSizeInput = {
  ne?: number | null,
  eq?: number | null,
  le?: number | null,
  lt?: number | null,
  ge?: number | null,
  gt?: number | null,
  between?: Array< number | null > | null,
};

export type MsgUser = {
  __typename: "MsgUser",
  id: string,
  name: string,
  updatedAt: string,
  pushToken?: string | null,
  createdAt: string,
};

export type UpdateMsgUserInput = {
  id: string,
  name?: string | null,
  updatedAt?: string | null,
  pushToken?: string | null,
};

export type DeleteMsgUserInput = {
  id: string,
};

export type CreateUserChatInput = {
  id?: string | null,
  lastMsg?: string | null,
  mod: number,
  updatedAt?: string | null,
  createdAt?: string | null,
  status: string,
  userChatFirstUserId?: string | null,
  userChatSecondUserId?: string | null,
};

export type ModelUserChatConditionInput = {
  lastMsg?: ModelStringInput | null,
  mod?: ModelIntInput | null,
  updatedAt?: ModelStringInput | null,
  createdAt?: ModelStringInput | null,
  status?: ModelStringInput | null,
  and?: Array< ModelUserChatConditionInput | null > | null,
  or?: Array< ModelUserChatConditionInput | null > | null,
  not?: ModelUserChatConditionInput | null,
  userChatFirstUserId?: ModelIDInput | null,
  userChatSecondUserId?: ModelIDInput | null,
};

export type ModelIntInput = {
  ne?: number | null,
  eq?: number | null,
  le?: number | null,
  lt?: number | null,
  ge?: number | null,
  gt?: number | null,
  between?: Array< number | null > | null,
  attributeExists?: boolean | null,
  attributeType?: ModelAttributeTypes | null,
};

export type ModelIDInput = {
  ne?: string | null,
  eq?: string | null,
  le?: string | null,
  lt?: string | null,
  ge?: string | null,
  gt?: string | null,
  contains?: string | null,
  notContains?: string | null,
  between?: Array< string | null > | null,
  beginsWith?: string | null,
  attributeExists?: boolean | null,
  attributeType?: ModelAttributeTypes | null,
  size?: ModelSizeInput | null,
};

export type UserChat = {
  __typename: "UserChat",
  id: string,
  firstUser?: MsgUser | null,
  secondUser?: MsgUser | null,
  lastMsg?: string | null,
  messages?: ModelSentMsgConnection | null,
  mod: number,
  updatedAt: string,
  createdAt: string,
  status: string,
  userChatFirstUserId?: string | null,
  userChatSecondUserId?: string | null,
};

export type ModelSentMsgConnection = {
  __typename: "ModelSentMsgConnection",
  items:  Array<SentMsg | null >,
  nextToken?: string | null,
};

export type SentMsg = {
  __typename: "SentMsg",
  id: string,
  chat?: UserChat | null,
  sender?: MsgUser | null,
  text: string,
  updatedAt: string,
  status: string,
  createdAt: string,
  userChatMessagesId?: string | null,
  sentMsgChatId?: string | null,
  sentMsgSenderId?: string | null,
};

export type UpdateUserChatInput = {
  id: string,
  lastMsg?: string | null,
  mod?: number | null,
  updatedAt?: string | null,
  createdAt?: string | null,
  status?: string | null,
  userChatFirstUserId?: string | null,
  userChatSecondUserId?: string | null,
};

export type DeleteUserChatInput = {
  id: string,
};

export type CreateSentMsgInput = {
  id?: string | null,
  text: string,
  updatedAt?: string | null,
  status: string,
  userChatMessagesId?: string | null,
  sentMsgChatId?: string | null,
  sentMsgSenderId?: string | null,
};

export type ModelSentMsgConditionInput = {
  text?: ModelStringInput | null,
  updatedAt?: ModelStringInput | null,
  status?: ModelStringInput | null,
  and?: Array< ModelSentMsgConditionInput | null > | null,
  or?: Array< ModelSentMsgConditionInput | null > | null,
  not?: ModelSentMsgConditionInput | null,
  userChatMessagesId?: ModelIDInput | null,
  sentMsgChatId?: ModelIDInput | null,
  sentMsgSenderId?: ModelIDInput | null,
};

export type UpdateSentMsgInput = {
  id: string,
  text?: string | null,
  updatedAt?: string | null,
  status?: string | null,
  userChatMessagesId?: string | null,
  sentMsgChatId?: string | null,
  sentMsgSenderId?: string | null,
};

export type DeleteSentMsgInput = {
  id: string,
};

export type ModelMsgUserFilterInput = {
  id?: ModelIDInput | null,
  name?: ModelStringInput | null,
  updatedAt?: ModelStringInput | null,
  pushToken?: ModelStringInput | null,
  and?: Array< ModelMsgUserFilterInput | null > | null,
  or?: Array< ModelMsgUserFilterInput | null > | null,
  not?: ModelMsgUserFilterInput | null,
};

export type ModelMsgUserConnection = {
  __typename: "ModelMsgUserConnection",
  items:  Array<MsgUser | null >,
  nextToken?: string | null,
};

export type ModelUserChatFilterInput = {
  id?: ModelIDInput | null,
  lastMsg?: ModelStringInput | null,
  mod?: ModelIntInput | null,
  updatedAt?: ModelStringInput | null,
  createdAt?: ModelStringInput | null,
  status?: ModelStringInput | null,
  and?: Array< ModelUserChatFilterInput | null > | null,
  or?: Array< ModelUserChatFilterInput | null > | null,
  not?: ModelUserChatFilterInput | null,
  userChatFirstUserId?: ModelIDInput | null,
  userChatSecondUserId?: ModelIDInput | null,
};

export type ModelUserChatConnection = {
  __typename: "ModelUserChatConnection",
  items:  Array<UserChat | null >,
  nextToken?: string | null,
};

export type ModelSentMsgFilterInput = {
  id?: ModelIDInput | null,
  text?: ModelStringInput | null,
  updatedAt?: ModelStringInput | null,
  status?: ModelStringInput | null,
  and?: Array< ModelSentMsgFilterInput | null > | null,
  or?: Array< ModelSentMsgFilterInput | null > | null,
  not?: ModelSentMsgFilterInput | null,
  userChatMessagesId?: ModelIDInput | null,
  sentMsgChatId?: ModelIDInput | null,
  sentMsgSenderId?: ModelIDInput | null,
};

export type ModelStringKeyConditionInput = {
  eq?: string | null,
  le?: string | null,
  lt?: string | null,
  ge?: string | null,
  gt?: string | null,
  between?: Array< string | null > | null,
  beginsWith?: string | null,
};

export enum ModelSortDirection {
  ASC = "ASC",
  DESC = "DESC",
}


export type CreateMsgUserMutationVariables = {
  input: CreateMsgUserInput,
  condition?: ModelMsgUserConditionInput | null,
};

export type CreateMsgUserMutation = {
  createMsgUser?:  {
    __typename: "MsgUser",
    id: string,
    name: string,
    updatedAt: string,
    pushToken?: string | null,
    createdAt: string,
  } | null,
};

export type UpdateMsgUserMutationVariables = {
  input: UpdateMsgUserInput,
  condition?: ModelMsgUserConditionInput | null,
};

export type UpdateMsgUserMutation = {
  updateMsgUser?:  {
    __typename: "MsgUser",
    id: string,
    name: string,
    updatedAt: string,
    pushToken?: string | null,
    createdAt: string,
  } | null,
};

export type DeleteMsgUserMutationVariables = {
  input: DeleteMsgUserInput,
  condition?: ModelMsgUserConditionInput | null,
};

export type DeleteMsgUserMutation = {
  deleteMsgUser?:  {
    __typename: "MsgUser",
    id: string,
    name: string,
    updatedAt: string,
    pushToken?: string | null,
    createdAt: string,
  } | null,
};

export type CreateUserChatMutationVariables = {
  input: CreateUserChatInput,
  condition?: ModelUserChatConditionInput | null,
};

export type CreateUserChatMutation = {
  createUserChat?:  {
    __typename: "UserChat",
    id: string,
    firstUser?:  {
      __typename: "MsgUser",
      id: string,
      name: string,
      updatedAt: string,
      pushToken?: string | null,
      createdAt: string,
    } | null,
    secondUser?:  {
      __typename: "MsgUser",
      id: string,
      name: string,
      updatedAt: string,
      pushToken?: string | null,
      createdAt: string,
    } | null,
    lastMsg?: string | null,
    messages?:  {
      __typename: "ModelSentMsgConnection",
      items:  Array< {
        __typename: "SentMsg",
        id: string,
        text: string,
        updatedAt: string,
        status: string,
        createdAt: string,
        userChatMessagesId?: string | null,
        sentMsgChatId?: string | null,
        sentMsgSenderId?: string | null,
      } | null >,
      nextToken?: string | null,
    } | null,
    mod: number,
    updatedAt: string,
    createdAt: string,
    status: string,
    userChatFirstUserId?: string | null,
    userChatSecondUserId?: string | null,
  } | null,
};

export type UpdateUserChatMutationVariables = {
  input: UpdateUserChatInput,
  condition?: ModelUserChatConditionInput | null,
};

export type UpdateUserChatMutation = {
  updateUserChat?:  {
    __typename: "UserChat",
    id: string,
    firstUser?:  {
      __typename: "MsgUser",
      id: string,
      name: string,
      updatedAt: string,
      pushToken?: string | null,
      createdAt: string,
    } | null,
    secondUser?:  {
      __typename: "MsgUser",
      id: string,
      name: string,
      updatedAt: string,
      pushToken?: string | null,
      createdAt: string,
    } | null,
    lastMsg?: string | null,
    messages?:  {
      __typename: "ModelSentMsgConnection",
      items:  Array< {
        __typename: "SentMsg",
        id: string,
        text: string,
        updatedAt: string,
        status: string,
        createdAt: string,
        userChatMessagesId?: string | null,
        sentMsgChatId?: string | null,
        sentMsgSenderId?: string | null,
      } | null >,
      nextToken?: string | null,
    } | null,
    mod: number,
    updatedAt: string,
    createdAt: string,
    status: string,
    userChatFirstUserId?: string | null,
    userChatSecondUserId?: string | null,
  } | null,
};

export type DeleteUserChatMutationVariables = {
  input: DeleteUserChatInput,
  condition?: ModelUserChatConditionInput | null,
};

export type DeleteUserChatMutation = {
  deleteUserChat?:  {
    __typename: "UserChat",
    id: string,
    firstUser?:  {
      __typename: "MsgUser",
      id: string,
      name: string,
      updatedAt: string,
      pushToken?: string | null,
      createdAt: string,
    } | null,
    secondUser?:  {
      __typename: "MsgUser",
      id: string,
      name: string,
      updatedAt: string,
      pushToken?: string | null,
      createdAt: string,
    } | null,
    lastMsg?: string | null,
    messages?:  {
      __typename: "ModelSentMsgConnection",
      items:  Array< {
        __typename: "SentMsg",
        id: string,
        text: string,
        updatedAt: string,
        status: string,
        createdAt: string,
        userChatMessagesId?: string | null,
        sentMsgChatId?: string | null,
        sentMsgSenderId?: string | null,
      } | null >,
      nextToken?: string | null,
    } | null,
    mod: number,
    updatedAt: string,
    createdAt: string,
    status: string,
    userChatFirstUserId?: string | null,
    userChatSecondUserId?: string | null,
  } | null,
};

export type CreateSentMsgMutationVariables = {
  input: CreateSentMsgInput,
  condition?: ModelSentMsgConditionInput | null,
};

export type CreateSentMsgMutation = {
  createSentMsg?:  {
    __typename: "SentMsg",
    id: string,
    chat?:  {
      __typename: "UserChat",
      id: string,
      firstUser?:  {
        __typename: "MsgUser",
        id: string,
        name: string,
        updatedAt: string,
        pushToken?: string | null,
        createdAt: string,
      } | null,
      secondUser?:  {
        __typename: "MsgUser",
        id: string,
        name: string,
        updatedAt: string,
        pushToken?: string | null,
        createdAt: string,
      } | null,
      lastMsg?: string | null,
      messages?:  {
        __typename: "ModelSentMsgConnection",
        nextToken?: string | null,
      } | null,
      mod: number,
      updatedAt: string,
      createdAt: string,
      status: string,
      userChatFirstUserId?: string | null,
      userChatSecondUserId?: string | null,
    } | null,
    sender?:  {
      __typename: "MsgUser",
      id: string,
      name: string,
      updatedAt: string,
      pushToken?: string | null,
      createdAt: string,
    } | null,
    text: string,
    updatedAt: string,
    status: string,
    createdAt: string,
    userChatMessagesId?: string | null,
    sentMsgChatId?: string | null,
    sentMsgSenderId?: string | null,
  } | null,
};

export type UpdateSentMsgMutationVariables = {
  input: UpdateSentMsgInput,
  condition?: ModelSentMsgConditionInput | null,
};

export type UpdateSentMsgMutation = {
  updateSentMsg?:  {
    __typename: "SentMsg",
    id: string,
    chat?:  {
      __typename: "UserChat",
      id: string,
      firstUser?:  {
        __typename: "MsgUser",
        id: string,
        name: string,
        updatedAt: string,
        pushToken?: string | null,
        createdAt: string,
      } | null,
      secondUser?:  {
        __typename: "MsgUser",
        id: string,
        name: string,
        updatedAt: string,
        pushToken?: string | null,
        createdAt: string,
      } | null,
      lastMsg?: string | null,
      messages?:  {
        __typename: "ModelSentMsgConnection",
        nextToken?: string | null,
      } | null,
      mod: number,
      updatedAt: string,
      createdAt: string,
      status: string,
      userChatFirstUserId?: string | null,
      userChatSecondUserId?: string | null,
    } | null,
    sender?:  {
      __typename: "MsgUser",
      id: string,
      name: string,
      updatedAt: string,
      pushToken?: string | null,
      createdAt: string,
    } | null,
    text: string,
    updatedAt: string,
    status: string,
    createdAt: string,
    userChatMessagesId?: string | null,
    sentMsgChatId?: string | null,
    sentMsgSenderId?: string | null,
  } | null,
};

export type DeleteSentMsgMutationVariables = {
  input: DeleteSentMsgInput,
  condition?: ModelSentMsgConditionInput | null,
};

export type DeleteSentMsgMutation = {
  deleteSentMsg?:  {
    __typename: "SentMsg",
    id: string,
    chat?:  {
      __typename: "UserChat",
      id: string,
      firstUser?:  {
        __typename: "MsgUser",
        id: string,
        name: string,
        updatedAt: string,
        pushToken?: string | null,
        createdAt: string,
      } | null,
      secondUser?:  {
        __typename: "MsgUser",
        id: string,
        name: string,
        updatedAt: string,
        pushToken?: string | null,
        createdAt: string,
      } | null,
      lastMsg?: string | null,
      messages?:  {
        __typename: "ModelSentMsgConnection",
        nextToken?: string | null,
      } | null,
      mod: number,
      updatedAt: string,
      createdAt: string,
      status: string,
      userChatFirstUserId?: string | null,
      userChatSecondUserId?: string | null,
    } | null,
    sender?:  {
      __typename: "MsgUser",
      id: string,
      name: string,
      updatedAt: string,
      pushToken?: string | null,
      createdAt: string,
    } | null,
    text: string,
    updatedAt: string,
    status: string,
    createdAt: string,
    userChatMessagesId?: string | null,
    sentMsgChatId?: string | null,
    sentMsgSenderId?: string | null,
  } | null,
};

export type GetMsgUserQueryVariables = {
  id: string,
};

export type GetMsgUserQuery = {
  getMsgUser?:  {
    __typename: "MsgUser",
    id: string,
    name: string,
    updatedAt: string,
    pushToken?: string | null,
    createdAt: string,
  } | null,
};

export type ListMsgUsersQueryVariables = {
  filter?: ModelMsgUserFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
};

export type ListMsgUsersQuery = {
  listMsgUsers?:  {
    __typename: "ModelMsgUserConnection",
    items:  Array< {
      __typename: "MsgUser",
      id: string,
      name: string,
      updatedAt: string,
      pushToken?: string | null,
      createdAt: string,
    } | null >,
    nextToken?: string | null,
  } | null,
};

export type GetUserChatQueryVariables = {
  id: string,
};

export type GetUserChatQuery = {
  getUserChat?:  {
    __typename: "UserChat",
    id: string,
    firstUser?:  {
      __typename: "MsgUser",
      id: string,
      name: string,
      updatedAt: string,
      pushToken?: string | null,
      createdAt: string,
    } | null,
    secondUser?:  {
      __typename: "MsgUser",
      id: string,
      name: string,
      updatedAt: string,
      pushToken?: string | null,
      createdAt: string,
    } | null,
    lastMsg?: string | null,
    messages?:  {
      __typename: "ModelSentMsgConnection",
      items:  Array< {
        __typename: "SentMsg",
        id: string,
        text: string,
        updatedAt: string,
        status: string,
        createdAt: string,
        userChatMessagesId?: string | null,
        sentMsgChatId?: string | null,
        sentMsgSenderId?: string | null,
      } | null >,
      nextToken?: string | null,
    } | null,
    mod: number,
    updatedAt: string,
    createdAt: string,
    status: string,
    userChatFirstUserId?: string | null,
    userChatSecondUserId?: string | null,
  } | null,
};

export type ListUserChatsQueryVariables = {
  filter?: ModelUserChatFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
};

export type ListUserChatsQuery = {
  listUserChats?:  {
    __typename: "ModelUserChatConnection",
    items:  Array< {
      __typename: "UserChat",
      id: string,
      firstUser?:  {
        __typename: "MsgUser",
        id: string,
        name: string,
        updatedAt: string,
        pushToken?: string | null,
        createdAt: string,
      } | null,
      secondUser?:  {
        __typename: "MsgUser",
        id: string,
        name: string,
        updatedAt: string,
        pushToken?: string | null,
        createdAt: string,
      } | null,
      lastMsg?: string | null,
      messages?:  {
        __typename: "ModelSentMsgConnection",
        nextToken?: string | null,
      } | null,
      mod: number,
      updatedAt: string,
      createdAt: string,
      status: string,
      userChatFirstUserId?: string | null,
      userChatSecondUserId?: string | null,
    } | null >,
    nextToken?: string | null,
  } | null,
};

export type GetSentMsgQueryVariables = {
  id: string,
};

export type GetSentMsgQuery = {
  getSentMsg?:  {
    __typename: "SentMsg",
    id: string,
    chat?:  {
      __typename: "UserChat",
      id: string,
      firstUser?:  {
        __typename: "MsgUser",
        id: string,
        name: string,
        updatedAt: string,
        pushToken?: string | null,
        createdAt: string,
      } | null,
      secondUser?:  {
        __typename: "MsgUser",
        id: string,
        name: string,
        updatedAt: string,
        pushToken?: string | null,
        createdAt: string,
      } | null,
      lastMsg?: string | null,
      messages?:  {
        __typename: "ModelSentMsgConnection",
        nextToken?: string | null,
      } | null,
      mod: number,
      updatedAt: string,
      createdAt: string,
      status: string,
      userChatFirstUserId?: string | null,
      userChatSecondUserId?: string | null,
    } | null,
    sender?:  {
      __typename: "MsgUser",
      id: string,
      name: string,
      updatedAt: string,
      pushToken?: string | null,
      createdAt: string,
    } | null,
    text: string,
    updatedAt: string,
    status: string,
    createdAt: string,
    userChatMessagesId?: string | null,
    sentMsgChatId?: string | null,
    sentMsgSenderId?: string | null,
  } | null,
};

export type ListSentMsgsQueryVariables = {
  filter?: ModelSentMsgFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
};

export type ListSentMsgsQuery = {
  listSentMsgs?:  {
    __typename: "ModelSentMsgConnection",
    items:  Array< {
      __typename: "SentMsg",
      id: string,
      chat?:  {
        __typename: "UserChat",
        id: string,
        lastMsg?: string | null,
        mod: number,
        updatedAt: string,
        createdAt: string,
        status: string,
        userChatFirstUserId?: string | null,
        userChatSecondUserId?: string | null,
      } | null,
      sender?:  {
        __typename: "MsgUser",
        id: string,
        name: string,
        updatedAt: string,
        pushToken?: string | null,
        createdAt: string,
      } | null,
      text: string,
      updatedAt: string,
      status: string,
      createdAt: string,
      userChatMessagesId?: string | null,
      sentMsgChatId?: string | null,
      sentMsgSenderId?: string | null,
    } | null >,
    nextToken?: string | null,
  } | null,
};

export type ChatByDateQueryVariables = {
  status: string,
  updatedAt?: ModelStringKeyConditionInput | null,
  sortDirection?: ModelSortDirection | null,
  filter?: ModelUserChatFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
};

export type ChatByDateQuery = {
  chatByDate?:  {
    __typename: "ModelUserChatConnection",
    items:  Array< {
      __typename: "UserChat",
      id: string,
      firstUser?:  {
        __typename: "MsgUser",
        id: string,
        name: string,
        updatedAt: string,
        pushToken?: string | null,
        createdAt: string,
      } | null,
      secondUser?:  {
        __typename: "MsgUser",
        id: string,
        name: string,
        updatedAt: string,
        pushToken?: string | null,
        createdAt: string,
      } | null,
      lastMsg?: string | null,
      messages?:  {
        __typename: "ModelSentMsgConnection",
        nextToken?: string | null,
      } | null,
      mod: number,
      updatedAt: string,
      createdAt: string,
      status: string,
      userChatFirstUserId?: string | null,
      userChatSecondUserId?: string | null,
    } | null >,
    nextToken?: string | null,
  } | null,
};

export type MsgByDateQueryVariables = {
  status: string,
  updatedAt?: ModelStringKeyConditionInput | null,
  sortDirection?: ModelSortDirection | null,
  filter?: ModelSentMsgFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
};

export type MsgByDateQuery = {
  msgByDate?:  {
    __typename: "ModelSentMsgConnection",
    items:  Array< {
      __typename: "SentMsg",
      id: string,
      chat?:  {
        __typename: "UserChat",
        id: string,
        lastMsg?: string | null,
        mod: number,
        updatedAt: string,
        createdAt: string,
        status: string,
        userChatFirstUserId?: string | null,
        userChatSecondUserId?: string | null,
      } | null,
      sender?:  {
        __typename: "MsgUser",
        id: string,
        name: string,
        updatedAt: string,
        pushToken?: string | null,
        createdAt: string,
      } | null,
      text: string,
      updatedAt: string,
      status: string,
      createdAt: string,
      userChatMessagesId?: string | null,
      sentMsgChatId?: string | null,
      sentMsgSenderId?: string | null,
    } | null >,
    nextToken?: string | null,
  } | null,
};

export type OnCreateMsgUserSubscription = {
  onCreateMsgUser?:  {
    __typename: "MsgUser",
    id: string,
    name: string,
    updatedAt: string,
    pushToken?: string | null,
    createdAt: string,
  } | null,
};

export type OnUpdateMsgUserSubscription = {
  onUpdateMsgUser?:  {
    __typename: "MsgUser",
    id: string,
    name: string,
    updatedAt: string,
    pushToken?: string | null,
    createdAt: string,
  } | null,
};

export type OnDeleteMsgUserSubscription = {
  onDeleteMsgUser?:  {
    __typename: "MsgUser",
    id: string,
    name: string,
    updatedAt: string,
    pushToken?: string | null,
    createdAt: string,
  } | null,
};

export type OnCreateUserChatSubscription = {
  onCreateUserChat?:  {
    __typename: "UserChat",
    id: string,
    firstUser?:  {
      __typename: "MsgUser",
      id: string,
      name: string,
      updatedAt: string,
      pushToken?: string | null,
      createdAt: string,
    } | null,
    secondUser?:  {
      __typename: "MsgUser",
      id: string,
      name: string,
      updatedAt: string,
      pushToken?: string | null,
      createdAt: string,
    } | null,
    lastMsg?: string | null,
    messages?:  {
      __typename: "ModelSentMsgConnection",
      items:  Array< {
        __typename: "SentMsg",
        id: string,
        text: string,
        updatedAt: string,
        status: string,
        createdAt: string,
        userChatMessagesId?: string | null,
        sentMsgChatId?: string | null,
        sentMsgSenderId?: string | null,
      } | null >,
      nextToken?: string | null,
    } | null,
    mod: number,
    updatedAt: string,
    createdAt: string,
    status: string,
    userChatFirstUserId?: string | null,
    userChatSecondUserId?: string | null,
  } | null,
};

export type OnUpdateUserChatSubscription = {
  onUpdateUserChat?:  {
    __typename: "UserChat",
    id: string,
    firstUser?:  {
      __typename: "MsgUser",
      id: string,
      name: string,
      updatedAt: string,
      pushToken?: string | null,
      createdAt: string,
    } | null,
    secondUser?:  {
      __typename: "MsgUser",
      id: string,
      name: string,
      updatedAt: string,
      pushToken?: string | null,
      createdAt: string,
    } | null,
    lastMsg?: string | null,
    messages?:  {
      __typename: "ModelSentMsgConnection",
      items:  Array< {
        __typename: "SentMsg",
        id: string,
        text: string,
        updatedAt: string,
        status: string,
        createdAt: string,
        userChatMessagesId?: string | null,
        sentMsgChatId?: string | null,
        sentMsgSenderId?: string | null,
      } | null >,
      nextToken?: string | null,
    } | null,
    mod: number,
    updatedAt: string,
    createdAt: string,
    status: string,
    userChatFirstUserId?: string | null,
    userChatSecondUserId?: string | null,
  } | null,
};

export type OnDeleteUserChatSubscription = {
  onDeleteUserChat?:  {
    __typename: "UserChat",
    id: string,
    firstUser?:  {
      __typename: "MsgUser",
      id: string,
      name: string,
      updatedAt: string,
      pushToken?: string | null,
      createdAt: string,
    } | null,
    secondUser?:  {
      __typename: "MsgUser",
      id: string,
      name: string,
      updatedAt: string,
      pushToken?: string | null,
      createdAt: string,
    } | null,
    lastMsg?: string | null,
    messages?:  {
      __typename: "ModelSentMsgConnection",
      items:  Array< {
        __typename: "SentMsg",
        id: string,
        text: string,
        updatedAt: string,
        status: string,
        createdAt: string,
        userChatMessagesId?: string | null,
        sentMsgChatId?: string | null,
        sentMsgSenderId?: string | null,
      } | null >,
      nextToken?: string | null,
    } | null,
    mod: number,
    updatedAt: string,
    createdAt: string,
    status: string,
    userChatFirstUserId?: string | null,
    userChatSecondUserId?: string | null,
  } | null,
};

export type OnCreateSentMsgSubscription = {
  onCreateSentMsg?:  {
    __typename: "SentMsg",
    id: string,
    chat?:  {
      __typename: "UserChat",
      id: string,
      firstUser?:  {
        __typename: "MsgUser",
        id: string,
        name: string,
        updatedAt: string,
        pushToken?: string | null,
        createdAt: string,
      } | null,
      secondUser?:  {
        __typename: "MsgUser",
        id: string,
        name: string,
        updatedAt: string,
        pushToken?: string | null,
        createdAt: string,
      } | null,
      lastMsg?: string | null,
      messages?:  {
        __typename: "ModelSentMsgConnection",
        nextToken?: string | null,
      } | null,
      mod: number,
      updatedAt: string,
      createdAt: string,
      status: string,
      userChatFirstUserId?: string | null,
      userChatSecondUserId?: string | null,
    } | null,
    sender?:  {
      __typename: "MsgUser",
      id: string,
      name: string,
      updatedAt: string,
      pushToken?: string | null,
      createdAt: string,
    } | null,
    text: string,
    updatedAt: string,
    status: string,
    createdAt: string,
    userChatMessagesId?: string | null,
    sentMsgChatId?: string | null,
    sentMsgSenderId?: string | null,
  } | null,
};

export type OnUpdateSentMsgSubscription = {
  onUpdateSentMsg?:  {
    __typename: "SentMsg",
    id: string,
    chat?:  {
      __typename: "UserChat",
      id: string,
      firstUser?:  {
        __typename: "MsgUser",
        id: string,
        name: string,
        updatedAt: string,
        pushToken?: string | null,
        createdAt: string,
      } | null,
      secondUser?:  {
        __typename: "MsgUser",
        id: string,
        name: string,
        updatedAt: string,
        pushToken?: string | null,
        createdAt: string,
      } | null,
      lastMsg?: string | null,
      messages?:  {
        __typename: "ModelSentMsgConnection",
        nextToken?: string | null,
      } | null,
      mod: number,
      updatedAt: string,
      createdAt: string,
      status: string,
      userChatFirstUserId?: string | null,
      userChatSecondUserId?: string | null,
    } | null,
    sender?:  {
      __typename: "MsgUser",
      id: string,
      name: string,
      updatedAt: string,
      pushToken?: string | null,
      createdAt: string,
    } | null,
    text: string,
    updatedAt: string,
    status: string,
    createdAt: string,
    userChatMessagesId?: string | null,
    sentMsgChatId?: string | null,
    sentMsgSenderId?: string | null,
  } | null,
};

export type OnDeleteSentMsgSubscription = {
  onDeleteSentMsg?:  {
    __typename: "SentMsg",
    id: string,
    chat?:  {
      __typename: "UserChat",
      id: string,
      firstUser?:  {
        __typename: "MsgUser",
        id: string,
        name: string,
        updatedAt: string,
        pushToken?: string | null,
        createdAt: string,
      } | null,
      secondUser?:  {
        __typename: "MsgUser",
        id: string,
        name: string,
        updatedAt: string,
        pushToken?: string | null,
        createdAt: string,
      } | null,
      lastMsg?: string | null,
      messages?:  {
        __typename: "ModelSentMsgConnection",
        nextToken?: string | null,
      } | null,
      mod: number,
      updatedAt: string,
      createdAt: string,
      status: string,
      userChatFirstUserId?: string | null,
      userChatSecondUserId?: string | null,
    } | null,
    sender?:  {
      __typename: "MsgUser",
      id: string,
      name: string,
      updatedAt: string,
      pushToken?: string | null,
      createdAt: string,
    } | null,
    text: string,
    updatedAt: string,
    status: string,
    createdAt: string,
    userChatMessagesId?: string | null,
    sentMsgChatId?: string | null,
    sentMsgSenderId?: string | null,
  } | null,
};
