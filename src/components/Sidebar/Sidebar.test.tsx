import { render, screen } from "@testing-library/react";
import { Provider } from "react-redux";
import configureStore from "redux-mock-store";
import { Sidebar } from "./Sidebar";
import { RootState } from "../../app/store";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";

const mockStore = configureStore([]);

describe("Sidebar Component", () => {
  const initialState: RootState = {
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
  };

  const renderComponent = (state: RootState = initialState) => {
    const store = mockStore(state);
    return render(
      <DndProvider backend={HTML5Backend}>
        <Provider store={store}>
          <Sidebar />
        </Provider>
      </DndProvider>
    );
  };

  it("renders the sidebar with correct elements", () => {
    renderComponent();

    expect(screen.getByText("Media Gallery")).toBeInTheDocument();
    expect(screen.getByText("Folders")).toBeInTheDocument();
    expect(screen.getByText("Filters")).toBeInTheDocument();

    expect(screen.getByLabelText("Image (1)")).toBeInTheDocument();
    expect(screen.getByLabelText("Video (1)")).toBeInTheDocument();
    expect(screen.getByLabelText("Gif (0)")).toBeInTheDocument();
  });

  it("displays correct media counts for selected folder", () => {
    renderComponent();

    expect(screen.getByLabelText("Image (1)")).toBeInTheDocument();
    expect(screen.getByLabelText("Video (1)")).toBeInTheDocument();
    expect(screen.getByLabelText("Gif (0)")).toBeInTheDocument();
  });

  it("updates media counts when folder changes", () => {
    const stateWithDifferentFolder = {
      ...initialState,
      folders: {
        ...initialState.folders,
        selectedFolderId: "new-folder",
      },
    };

    renderComponent(stateWithDifferentFolder);

    expect(screen.getByLabelText("Image (0)")).toBeInTheDocument();
    expect(screen.getByLabelText("Video (0)")).toBeInTheDocument();
    expect(screen.getByLabelText("Gif (0)")).toBeInTheDocument();
  });
});
