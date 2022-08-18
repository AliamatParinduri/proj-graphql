const {
  GraphQLString,
  GraphQLObjectType,
  GraphQLID,
  GraphQLSchema,
  GraphQLList,
  GraphQLNonNull,
  GraphQLEnumType,
  graphql,
} = require("graphql")

const Project = require("../models/Project")
const Client = require("../models/Client")

const ClientType = new GraphQLObjectType({
  name: "Client",
  fields: () => ({
    id: { type: GraphQLString },
    name: { type: GraphQLString },
    email: { type: GraphQLString },
    phone: { type: GraphQLString },
  }),
})

const ProjectType = new GraphQLObjectType({
  name: "Project",
  fields: () => ({
    id: { type: GraphQLString },
    name: { type: GraphQLString },
    description: { type: GraphQLString },
    status: { type: GraphQLString },
    client: {
      type: ClientType,
      resolve: async (parent, args) => {
        // return clients.find((client) => client.id === parent.id)
        const client = await Client.findById(parent.client)
        return client
      },
    },
  }),
})

const RootQuery = new GraphQLObjectType({
  name: "RootQueryType",
  fields: {
    projects: {
      type: new GraphQLList(ProjectType),
      resolve: async (parent, args) => {
        return await Project.find()
      },
    },
    project: {
      type: ProjectType,
      args: { id: { type: GraphQLID } },
      resolve: async (parent, args) => {
        // return projects.find((project) => project.id === args.id)
        return await Project.findById(args.id)
      },
    },

    clients: {
      type: new GraphQLList(ClientType),
      resolve: async (parent, args) => {
        return await Client.find()
      },
    },
    client: {
      type: ClientType,
      args: { id: { type: GraphQLID } },
      resolve: async (parent, args) => {
        // return clients.find((client) => client.id === args.id)
        return await Client.findById(args.id)
      },
    },
  },
})

// Mutation
const mutation = new GraphQLObjectType({
  name: "Mutation",
  fields: {
    addClient: {
      type: ClientType,
      args: {
        email: { type: new GraphQLNonNull(GraphQLString) },
        name: { type: new GraphQLNonNull(GraphQLString) },
        phone: { type: new GraphQLNonNull(GraphQLString) },
      },
      resolve: async (parent, args) => {
        const client = await Client.create({
          name: args.name,
          email: args.email,
          phone: args.phone,
        })

        return client
      },
    },

    deleteClient: {
      type: ClientType,
      args: { id: { type: new GraphQLNonNull(GraphQLID) } },
      resolve: async (parent, args) => {
        const projects = await Project.find({ clientId: args.id })
        projects.forEach((project) => {
          project.remove()
        })

        return Client.findByIdAndDelete(args.id)
      },
    },

    addProject: {
      type: ProjectType,
      args: {
        name: { type: new GraphQLNonNull(GraphQLString) },
        description: { type: new GraphQLNonNull(GraphQLString) },
        status: {
          type: new GraphQLEnumType({
            name: "ProjectStatus",
            values: {
              new: { value: "Not Started" },
              progress: { value: "In Progress" },
              completed: { value: "Completed" },
            },
          }),
          defaultValue: "Not Started",
        },
        clientId: { type: new GraphQLNonNull(GraphQLID) },
      },
      resolve: async (parent, args) => {
        const project = await Project.create({
          name: args.name,
          description: args.description,
          status: args.status,
          client: args.clientId,
        })

        return project
      },
    },

    updateProject: {
      type: ProjectType,
      args: {
        id: { type: GraphQLNonNull(GraphQLID) },
        name: { type: new GraphQLNonNull(GraphQLString) },
        description: { type: new GraphQLNonNull(GraphQLString) },
        status: {
          type: new GraphQLEnumType({
            name: "ProjectStatusUpdate",
            values: {
              new: { value: "Not Started" },
              progress: { value: "In Progress" },
              completed: { value: "Completed" },
            },
          }),
        },
      },
      resolve: async (parent, args) => {
        const project = await Project.create({
          name: args.name,
          description: args.description,
          status: args.status,
          client: args.clientId,
        })

        return project
      },
    },

    deleteProject: {
      type: ProjectType,
      args: { id: { type: new GraphQLNonNull(GraphQLID) } },
      resolve: async (parent, args) => {
        return Project.findByIdAndDelete(args.id)
      },
    },
  },
})

module.exports = new GraphQLSchema({
  query: RootQuery,
  mutation,
})
