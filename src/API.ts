/* tslint:disable */
/* eslint-disable */
//  This file was automatically generated and should not be edited.

export type CreateMsgUserInput = {
  id?: string | null,
  name: string,
  imageUri?: string | null,
};

export type ModelMsgUserConditionInput = {
  name?: ModelStringInput | null,
  imageUri?: ModelStringInput | null,
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
  imageUri?: string | null,
  createdAt: string,
  updatedAt: string,
};

export type UpdateMsgUserInput = {
  id: string,
  name?: string | null,
  imageUri?: string | null,
};

export type DeleteMsgUserInput = {
  id: string,
};

export type CreateUserChatInput = {
  lastMsg?: string | null,
  mode: number,
  id?: string | null,
  userChatFirstUserId?: string | null,
  userChatSecondUserId?: string | null,
};

export type ModelUserChatConditionInput = {
  lastMsg?: ModelStringInput | null,
  mode?: ModelIntInput | null,
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
  firstUser?: MsgUser | null,
  secondUser?: MsgUser | null,
  lastMsg?: string | null,
  mode: number,
  massages?: ModelSentMsgConnection | null,
  id: string,
  createdAt: string,
  updatedAt: string,
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
  sender?: MsgUser | null,
  text: string,
  createdAt: string,
  updatedAt: string,
  userChatMassagesId?: string | null,
  sentMsgSenderId?: string | null,
};

export type UpdateUserChatInput = {
  lastMsg?: string | null,
  mode?: number | null,
  id: string,
  userChatFirstUserId?: string | null,
  userChatSecondUserId?: string | null,
};

export type DeleteUserChatInput = {
  id: string,
};

export type CreateSentMsgInput = {
  id?: string | null,
  text: string,
  userChatMassagesId?: string | null,
  sentMsgSenderId?: string | null,
};

export type ModelSentMsgConditionInput = {
  text?: ModelStringInput | null,
  and?: Array< ModelSentMsgConditionInput | null > | null,
  or?: Array< ModelSentMsgConditionInput | null > | null,
  not?: ModelSentMsgConditionInput | null,
  userChatMassagesId?: ModelIDInput | null,
  sentMsgSenderId?: ModelIDInput | null,
};

export type UpdateSentMsgInput = {
  id: string,
  text?: string | null,
  userChatMassagesId?: string | null,
  sentMsgSenderId?: string | null,
};

export type DeleteSentMsgInput = {
  id: string,
};

export type ModelMsgUserFilterInput = {
  id?: ModelIDInput | null,
  name?: ModelStringInput | null,
  imageUri?: ModelStringInput | null,
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
  lastMsg?: ModelStringInput | null,
  mode?: ModelIntInput | null,
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
  and?: Array< ModelSentMsgFilterInput | null > | null,
  or?: Array< ModelSentMsgFilterInput | null > | null,
  not?: ModelSentMsgFilterInput | null,
  userChatMassagesId?: ModelIDInput | null,
  sentMsgSenderId?: ModelIDInput | null,
};

export type CreateMsgUserMutationVariables = {
  input: CreateMsgUserInput,
  condition?: ModelMsgUserConditionInput | null,
};

export type CreateMsgUserMutation = {
  createMsgUser?:  {
    __typename: "MsgUser",
    id: string,
    name: string,
    imageUri?: string | null,
    createdAt: string,
    updatedAt: string,
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
    imageUri?: string | null,
    createdAt: string,
    updatedAt: string,
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
    imageUri?: string | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type CreateUserChatMutationVariables = {
  input: CreateUserChatInput,
  condition?: ModelUserChatConditionInput | null,
};

export type CreateUserChatMutation = {
  createUserChat?:  {
    __typename: "UserChat",
    firstUser?:  {
      __typename: "MsgUser",
      id: string,
      name: string,
      imageUri?: string | null,
      createdAt: string,
      updatedAt: string,
    } | null,
    secondUser?:  {
      __typename: "MsgUser",
      id: string,
      name: string,
      imageUri?: string | null,
      createdAt: string,
      updatedAt: string,
    } | null,
    lastMsg?: string | null,
    mode: number,
    massages?:  {
      __typename: "ModelSentMsgConnection",
      items:  Array< {
        __typename: "SentMsg",
        id: string,
        text: string,
        createdAt: string,
        updatedAt: string,
        userChatMassagesId?: string | null,
        sentMsgSenderId?: string | null,
      } | null >,
      nextToken?: string | null,
    } | null,
    id: string,
    createdAt: string,
    updatedAt: string,
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
    firstUser?:  {
      __typename: "MsgUser",
      id: string,
      name: string,
      imageUri?: string | null,
      createdAt: string,
      updatedAt: string,
    } | null,
    secondUser?:  {
      __typename: "MsgUser",
      id: string,
      name: string,
      imageUri?: string | null,
      createdAt: string,
      updatedAt: string,
    } | null,
    lastMsg?: string | null,
    mode: number,
    massages?:  {
      __typename: "ModelSentMsgConnection",
      items:  Array< {
        __typename: "SentMsg",
        id: string,
        text: string,
        createdAt: string,
        updatedAt: string,
        userChatMassagesId?: string | null,
        sentMsgSenderId?: string | null,
      } | null >,
      nextToken?: string | null,
    } | null,
    id: string,
    createdAt: string,
    updatedAt: string,
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
    firstUser?:  {
      __typename: "MsgUser",
      id: string,
      name: string,
      imageUri?: string | null,
      createdAt: string,
      updatedAt: string,
    } | null,
    secondUser?:  {
      __typename: "MsgUser",
      id: string,
      name: string,
      imageUri?: string | null,
      createdAt: string,
      updatedAt: string,
    } | null,
    lastMsg?: string | null,
    mode: number,
    massages?:  {
      __typename: "ModelSentMsgConnection",
      items:  Array< {
        __typename: "SentMsg",
        id: string,
        text: string,
        createdAt: string,
        updatedAt: string,
        userChatMassagesId?: string | null,
        sentMsgSenderId?: string | null,
      } | null >,
      nextToken?: string | null,
    } | null,
    id: string,
    createdAt: string,
    updatedAt: string,
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
    sender?:  {
      __typename: "MsgUser",
      id: string,
      name: string,
      imageUri?: string | null,
      createdAt: string,
      updatedAt: string,
    } | null,
    text: string,
    createdAt: string,
    updatedAt: string,
    userChatMassagesId?: string | null,
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
    sender?:  {
      __typename: "MsgUser",
      id: string,
      name: string,
      imageUri?: string | null,
      createdAt: string,
      updatedAt: string,
    } | null,
    text: string,
    createdAt: string,
    updatedAt: string,
    userChatMassagesId?: string | null,
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
    sender?:  {
      __typename: "MsgUser",
      id: string,
      name: string,
      imageUri?: string | null,
      createdAt: string,
      updatedAt: string,
    } | null,
    text: string,
    createdAt: string,
    updatedAt: string,
    userChatMassagesId?: string | null,
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
    imageUri?: string | null,
    createdAt: string,
    updatedAt: string,
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
      imageUri?: string | null,
      createdAt: string,
      updatedAt: string,
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
    firstUser?:  {
      __typename: "MsgUser",
      id: string,
      name: string,
      imageUri?: string | null,
      createdAt: string,
      updatedAt: string,
    } | null,
    secondUser?:  {
      __typename: "MsgUser",
      id: string,
      name: string,
      imageUri?: string | null,
      createdAt: string,
      updatedAt: string,
    } | null,
    lastMsg?: string | null,
    mode: number,
    massages?:  {
      __typename: "ModelSentMsgConnection",
      items:  Array< {
        __typename: "SentMsg",
        id: string,
        text: string,
        createdAt: string,
        updatedAt: string,
        userChatMassagesId?: string | null,
        sentMsgSenderId?: string | null,
      } | null >,
      nextToken?: string | null,
    } | null,
    id: string,
    createdAt: string,
    updatedAt: string,
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
      firstUser?:  {
        __typename: "MsgUser",
        id: string,
        name: string,
        imageUri?: string | null,
        createdAt: string,
        updatedAt: string,
      } | null,
      secondUser?:  {
        __typename: "MsgUser",
        id: string,
        name: string,
        imageUri?: string | null,
        createdAt: string,
        updatedAt: string,
      } | null,
      lastMsg?: string | null,
      mode: number,
      massages?:  {
        __typename: "ModelSentMsgConnection",
        nextToken?: string | null,
      } | null,
      id: string,
      createdAt: string,
      updatedAt: string,
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
    sender?:  {
      __typename: "MsgUser",
      id: string,
      name: string,
      imageUri?: string | null,
      createdAt: string,
      updatedAt: string,
    } | null,
    text: string,
    createdAt: string,
    updatedAt: string,
    userChatMassagesId?: string | null,
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
      sender?:  {
        __typename: "MsgUser",
        id: string,
        name: string,
        imageUri?: string | null,
        createdAt: string,
        updatedAt: string,
      } | null,
      text: string,
      createdAt: string,
      updatedAt: string,
      userChatMassagesId?: string | null,
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
    imageUri?: string | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type OnUpdateMsgUserSubscription = {
  onUpdateMsgUser?:  {
    __typename: "MsgUser",
    id: string,
    name: string,
    imageUri?: string | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type OnDeleteMsgUserSubscription = {
  onDeleteMsgUser?:  {
    __typename: "MsgUser",
    id: string,
    name: string,
    imageUri?: string | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type OnCreateUserChatSubscription = {
  onCreateUserChat?:  {
    __typename: "UserChat",
    firstUser?:  {
      __typename: "MsgUser",
      id: string,
      name: string,
      imageUri?: string | null,
      createdAt: string,
      updatedAt: string,
    } | null,
    secondUser?:  {
      __typename: "MsgUser",
      id: string,
      name: string,
      imageUri?: string | null,
      createdAt: string,
      updatedAt: string,
    } | null,
    lastMsg?: string | null,
    mode: number,
    massages?:  {
      __typename: "ModelSentMsgConnection",
      items:  Array< {
        __typename: "SentMsg",
        id: string,
        text: string,
        createdAt: string,
        updatedAt: string,
        userChatMassagesId?: string | null,
        sentMsgSenderId?: string | null,
      } | null >,
      nextToken?: string | null,
    } | null,
    id: string,
    createdAt: string,
    updatedAt: string,
    userChatFirstUserId?: string | null,
    userChatSecondUserId?: string | null,
  } | null,
};

export type OnUpdateUserChatSubscription = {
  onUpdateUserChat?:  {
    __typename: "UserChat",
    firstUser?:  {
      __typename: "MsgUser",
      id: string,
      name: string,
      imageUri?: string | null,
      createdAt: string,
      updatedAt: string,
    } | null,
    secondUser?:  {
      __typename: "MsgUser",
      id: string,
      name: string,
      imageUri?: string | null,
      createdAt: string,
      updatedAt: string,
    } | null,
    lastMsg?: string | null,
    mode: number,
    massages?:  {
      __typename: "ModelSentMsgConnection",
      items:  Array< {
        __typename: "SentMsg",
        id: string,
        text: string,
        createdAt: string,
        updatedAt: string,
        userChatMassagesId?: string | null,
        sentMsgSenderId?: string | null,
      } | null >,
      nextToken?: string | null,
    } | null,
    id: string,
    createdAt: string,
    updatedAt: string,
    userChatFirstUserId?: string | null,
    userChatSecondUserId?: string | null,
  } | null,
};

export type OnDeleteUserChatSubscription = {
  onDeleteUserChat?:  {
    __typename: "UserChat",
    firstUser?:  {
      __typename: "MsgUser",
      id: string,
      name: string,
      imageUri?: string | null,
      createdAt: string,
      updatedAt: string,
    } | null,
    secondUser?:  {
      __typename: "MsgUser",
      id: string,
      name: string,
      imageUri?: string | null,
      createdAt: string,
      updatedAt: string,
    } | null,
    lastMsg?: string | null,
    mode: number,
    massages?:  {
      __typename: "ModelSentMsgConnection",
      items:  Array< {
        __typename: "SentMsg",
        id: string,
        text: string,
        createdAt: string,
        updatedAt: string,
        userChatMassagesId?: string | null,
        sentMsgSenderId?: string | null,
      } | null >,
      nextToken?: string | null,
    } | null,
    id: string,
    createdAt: string,
    updatedAt: string,
    userChatFirstUserId?: string | null,
    userChatSecondUserId?: string | null,
  } | null,
};

export type OnCreateSentMsgSubscription = {
  onCreateSentMsg?:  {
    __typename: "SentMsg",
    id: string,
    sender?:  {
      __typename: "MsgUser",
      id: string,
      name: string,
      imageUri?: string | null,
      createdAt: string,
      updatedAt: string,
    } | null,
    text: string,
    createdAt: string,
    updatedAt: string,
    userChatMassagesId?: string | null,
    sentMsgSenderId?: string | null,
  } | null,
};

export type OnUpdateSentMsgSubscription = {
  onUpdateSentMsg?:  {
    __typename: "SentMsg",
    id: string,
    sender?:  {
      __typename: "MsgUser",
      id: string,
      name: string,
      imageUri?: string | null,
      createdAt: string,
      updatedAt: string,
    } | null,
    text: string,
    createdAt: string,
    updatedAt: string,
    userChatMassagesId?: string | null,
    sentMsgSenderId?: string | null,
  } | null,
};

export type OnDeleteSentMsgSubscription = {
  onDeleteSentMsg?:  {
    __typename: "SentMsg",
    id: string,
    sender?:  {
      __typename: "MsgUser",
      id: string,
      name: string,
      imageUri?: string | null,
      createdAt: string,
      updatedAt: string,
    } | null,
    text: string,
    createdAt: string,
    updatedAt: string,
    userChatMassagesId?: string | null,
    sentMsgSenderId?: string | null,
  } | null,
};
