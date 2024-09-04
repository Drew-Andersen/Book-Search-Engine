const { User } = require('../models');
const { signToken, AuthenticationError } = require('../utils/auth');

const resolvers = {
    Query: {
        me: async (parent, args, context) => {
            if(context.user){
            const userData = await User.findOne({_id: context.user._id}).select('-password');
            return userData;
            }
        },
    },
    Mutation: {
        // Mutation to add a new user
        addUser: async (parent, { username, email, password }) => {
            const user = await User.create({ username, email, password });
            const token = signToken(user);
            return { token, user };
        },
        // Mutation to login with existing credentials
        login: async (parent, { email, password }) => {
            const user = await User.findOne({ email });
            if (!user || !(await user.isCorrectPassword(password))) {
                throw AuthenticationError;
            }
            const token = signToken(user);
            return { token, user };
        },
        saveBook: async (parent, {bookData}, context) => {
            if(context.user){
                const updatedUser = await User.findByIdAndUpdate(
                    { _id: context.user._id },
                    { $push: { savedBooks: bookData } },
                    { new: true, runValidators: true }
                );
                return updatedUser;
        }
        throw AuthenticationError;
        },
        removeBook: async (parent, {bookId}, context) => {
       
        if(context.user){
            console.log('resolver')
                const updatedUser = await User.findByIdAndUpdate(
                    { _id: context.user._id },
                    { $pull: { savedBooks: {bookId} } },
                    { new: true, runValidators: true }
                );
            return updatedUser;
            }
        throw AuthenticationError;
        }
    },
};

module.exports = resolvers;