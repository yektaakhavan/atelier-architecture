import { screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { getProjectDetails } from "@/data/project-details";
import fa from "@/messages/fa.json";
import { renderWithIntl } from "@/test-utils/render-with-intl";
import { ProjectGallery } from "./project-gallery";

const images = getProjectDetails("casa-olivo")!.gallery;

describe("ProjectGallery", () => {
  it("renders one accessible button per image and no open viewer", () => {
    renderWithIntl(<ProjectGallery images={images} title="Casa Olivo" />);

    expect(screen.getAllByRole("button", { name: /Open image \d of 3/ })).toHaveLength(
      images.length,
    );
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  it("opens the viewer on the chosen image and navigates through the set", async () => {
    renderWithIntl(<ProjectGallery images={images} title="Casa Olivo" />);
    await userEvent.click(screen.getByRole("button", { name: "Open image 2 of 3" }));

    const dialog = screen.getByRole("dialog", { name: "Image viewer" });
    expect(within(dialog).getByText("2 / 3")).toBeInTheDocument();
    expect(within(dialog).getByText("Casa Olivo, illustration 2")).toBeInTheDocument();

    await userEvent.click(within(dialog).getByRole("button", { name: "Next image" }));
    expect(within(dialog).getByText("3 / 3")).toBeInTheDocument();
  });

  it("closes the viewer", async () => {
    renderWithIntl(<ProjectGallery images={images} title="Casa Olivo" />);
    await userEvent.click(screen.getAllByRole("button", { name: /Open image/ })[0]!);
    await userEvent.click(screen.getByRole("button", { name: "Close" }));

    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  it("uses Persian labels and digits", async () => {
    renderWithIntl(<ProjectGallery images={images} title="خانه زیتون" />, { locale: "fa" });
    await userEvent.click(screen.getByRole("button", { name: "باز کردن تصویر ۱ از ۳" }));

    expect(
      screen.getByRole("dialog", { name: fa.ProjectDetail.lightboxLabel }),
    ).toBeInTheDocument();
    expect(screen.getByText("۱ / ۳")).toBeInTheDocument();
  });
});
