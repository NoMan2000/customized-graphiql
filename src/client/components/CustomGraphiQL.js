import { parse, print } from "graphql"

import GraphiQL, {
  Logo,
  Menu,
  MenuItem,
  Select,
  SelectOption,
  Toolbar
} from "graphiql"

import { pick, pickBy } from "lodash"

const { version } = require("../../../package.json")

// `undefined` is prefered over `null`, so that GraphiQL uses `defaultQuery`
const defaultState = {
  query: undefined,
  schema: undefined,
  variables: undefined
}

const stateFromURL = Array.from(
  new URLSearchParams(window.location.search)
).reduce(
  (acc, [key, value]) => ({
    ...acc,
    [key]: value
  }),
  {}
)

export default class CustomGraphiQL extends React.Component {
  ref = React.createRef()

  state = {
    ...defaultState,
    // Restrict state to only known keys
    ...pick(stateFromURL, Object.keys(defaultState))
  }

  handleEditQuery = (query) => {
    if (!query) {
      query = undefined
    }

    this.setState({ query })
  }

  handleEditVariables = (variables) => {
    if (!variables) {
      variables = undefined
    }

    this.setState({ variables })
  }

  // Prefer GraphiQL for the values of { operationName, query, variables }
  handleFetch = async (graphQLParams) => {
    // Send our custom state values (e.g. schema) as `req.query`
    const { query, variables, ...rest } = this.state
    const searchParams = new URLSearchParams(pickBy(rest))
    const url = `${window.location.origin}/graphql?${searchParams.toString()}`

    const res = await fetch(url, {
      method: "post",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json"
      },
      // Send graphQLParams as `req.body`
      body: JSON.stringify(graphQLParams)
    })

    const payload = await res.json()

    // 400s are returned if query/variables are invalid
    if (res.ok && query) {
      try {
        const formatted = print(parse(query))

        // Format successful queries ONLY if not already formatted.
        // (Otherwise this could create a constant update loop)
        if (query !== formatted) {
          this.setState({ query: formatted })
        }
      } catch (error) {}
    }

    return payload
  }

  // Reflect (truthy) state values in the URL for copy/paste/reload
  componentDidUpdate() {
    const queryString = new URLSearchParams(pickBy(this.state)).toString()

    window.history.replaceState(
      null,
      null,
      // Erase window.location.search if there's no query
      queryString ? `?${queryString}` : window.location.pathname
    )
  }

  render() {
    const { query, schema, variables } = this.state

    return (
      <GraphiQL
        fetcher={this.handleFetch}
        query={query}
        variables={variables}
        onEditQuery={this.handleEditQuery}
        onEditVariables={this.handleEditVariables}
        ref={this.ref}
      >
        <Logo>
          Customized GraphiQL <small>v{version}</small>
        </Logo>

        <Toolbar>
          <Select onSelect={(schema) => this.setState({ schema })}>
            <SelectOption
              label="Latest Schema"
              selected={!schema}
              value={null}
            />
            <SelectOption
              label="Mock Schema"
              selected={schema === "mock"}
              value="mock"
            />
          </Select>

          <Menu label="Export...">
            <MenuItem label="Swift" title="Swift" />
            <MenuItem label="TypeScript" title="TypeScript" />
          </Menu>
        </Toolbar>
      </GraphiQL>
    )
  }
}
