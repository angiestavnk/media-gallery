import { render, screen } from "@testing-library/react";
import { Provider } from "react-redux";
import configureStore from "redux-mock-store";
import { MainContent } from "./MainContent";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { vi } from "vitest";

vi.mock("../../services/fetch-media/fetch-media", () => ({
  FetchMediaService: {
    fetchMedia: vi.fn(),
  },
}));

vi.mock("../../features/folder-slice", () => ({
  moveMedia: vi.fn(),
}));

const mockStore = configureStore();

describe("MainContent", () => {
  let store: ReturnType<typeof mockStore>;

  beforeEach(() => {
    store = mockStore({
      folders: {
        folders: [
          {
            id: "root",
            name: "Your Folder",
            mediaIds: ["img-1", "vid-1"],
            children: [],
            counts: { image: 1, video: 1, gif: 0 },
          },
          {
            id: "new-folder",
            name: "New Folder",
            mediaIds: [],
            children: [],
            counts: { image: 0, video: 0, gif: 0 },
          },
        ],
        selectedFolderId: "root",
        selectedMediaIds: [],
        filters: {
          types: ["image", "video"],
        },
      },
      media: {
        media: [
          {
            id: "img-1",
            name: "Image 1",
            type: "image",
            url: "image1.jpg",
            width: 100,
            height: 100,
          },
          {
            id: "vid-1",
            name: "Video 1",
            type: "video",
            url: "video1.mp4",
            width: 100,
            height: 100,
          },
        ],
      },
    });

    store.dispatch = vi.fn();
  });

  it("displays filtered media", () => {
    render(
      <Provider store={store}>
        <DndProvider backend={HTML5Backend}>
          <MainContent />
        </DndProvider>
      </Provider>
    );

    expect(screen.getByText("Image 1")).toBeInTheDocument();
    expect(screen.getByText("Video 1")).toBeInTheDocument();
  });
});
