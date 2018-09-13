import GraphiQL, {
  Logo,
  Menu,
  MenuItem,
  Select,
  SelectOption,
  Toolbar
} from "graphiql"

import { pickBy } from "lodash"

const { version } = require("../../package.json")

export default class CustomGraphiQL extends React.Component {
  state = {
    schema: null
  }

  fetcher = (graphQLParams) => {
    const queryParams = new URLSearchParams(pickBy(this.state))
    const url = `${window.location.origin}/graphql?${queryParams.toString()}`

    return fetch(url, {
      method: "post",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(graphQLParams)
    }).then((response) => response.json())
  }

  render() {
    const { schema } = this.state

    return (
      <GraphiQL fetcher={this.fetcher}>
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
