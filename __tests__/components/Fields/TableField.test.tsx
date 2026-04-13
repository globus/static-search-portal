import { render } from "../../../test-utils";
import TableField from "../../../src/components/Fields/TableField";

describe("TableField", () => {
  it("renders table for object", () => {
    const { getByText, getByRole } = render(
      <TableField value={{ foo: "bar" }} />,
    );
    expect(getByRole("table")).toBeInTheDocument();
    expect(getByText("foo")).toBeInTheDocument();
    expect(getByText("bar")).toBeInTheDocument();
  });

  it("renders nothing for invalid value", () => {
    const { queryAllByText } = render(<TableField value={42} />);
    expect(queryAllByText("*")).toHaveLength(0);
  });
});
