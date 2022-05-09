import { AppDataSource } from "../data-source"
import { User } from "../entity/User"

const userRepository = AppDataSource.getRepository(User);

export const resolvers = {
  Query: {
    users: async(parent: any, args: any, req: any, info: any) => {
      const users = await userRepository.find();
      return users;
    },
    user: async(parent: any, args: any, req: any, info: any) => {
      const userId = args.userInput.id;
      const user = await userRepository.findOneBy({
        id: userId
      })
      return user;
    }
  },
  Mutation: {
    // createUser: async(parent: any, args: any, req: any, info: any) => {
    //   const user = args.userInput;
    //   users.push(user);
    //   return user;
    // },
    // updateUser: async(parent: any, args: any, req: any, info: any) => {
    //   const updatedUser = args.userInput;
    //   const updatedUserIndex = users.findIndex((user) => user.id === updatedUser.id);
    //   users[updatedUserIndex] = updatedUser;
    //   return updatedUser;
    // },
    // deleteUser: async(parent: any, args: any, req: any, info: any) => {
    //   const deletedUserId = args.userConfig.id;
    //   const deletedUserIndex = users.findIndex((user) => user.id === deletedUserId);
    //   const deletedUser = users.find((u, i) => i === deletedUserIndex);
    //   users.splice(deletedUserIndex, 1);
    //   return deletedUser;
    // },
    login: async (parent, { email, password }, context) => {
      const { user } = await context.authenticate('graphql-local', { email, password });
      context.login(user);
      return user;
    },
  }
}
