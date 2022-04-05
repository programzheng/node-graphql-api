const users = [
  {
    id: 1,
    user_info: {
      name: 'Jimmy1',
      age: 18,
    }
  },
  {
    id: 2,
    user_info: {
      name: 'Jimmy2',
      age: 20,
    }
  }
]


export const resolvers = {
  Query: {
    users: async(parent: any, args: any, context: any, info: any) => {
      return users;
    },
    user: async(parent: any, args: any, context: any, info: any) => {
      const userId = args.userInput.id;
      return users.find(v => v.id === userId);
    }
  },
  Mutation: {
    createUser: async(parent: any, args: any, context: any, info: any) => {
      const user = args.userInput;
      users.push(user);
      return user;
    },
    updateUser: async(parent: any, args: any, context: any, info: any) => {
      const updatedUser = args.userInput;
      const updatedUserIndex = users.findIndex((user) => user.id === updatedUser.id);
      users[updatedUserIndex] = updatedUser;
      return updatedUser;
    },
    deleteUser: async(parent: any, args: any, context: any, info: any) => {
      const deletedUserId = args.userConfig.id;
      const deletedUserIndex = users.findIndex((user) => user.id === deletedUserId);
      const deletedUser = users.find((u, i) => i === deletedUserIndex);
      users.splice(deletedUserIndex, 1);
      return deletedUser;
    },
  }
}
