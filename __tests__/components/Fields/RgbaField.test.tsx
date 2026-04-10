import { render } from "../../../test-utils";
import RgbaField from "../../../src/components/Fields/RgbaField";

describe("RgbaField", () => {
  it("renders RGBA color", () => {
    const { getByRole } = render(<RgbaField value={[255, 0, 0, 1]} />);
    expect(getByRole("code")).toHaveTextContent("R:255 G:0 B:0 A: 1");
  });

  it("renders nothing for invalid value", () => {
    const { queryAllByText } = render(<RgbaField value={42} />);
    expect(queryAllByText("*")).toHaveLength(0);
  });
});
