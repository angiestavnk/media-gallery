import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, vi } from "vitest";
import { Folder } from "../../features/folder-slice";
import { MediaToolbar } from "./MediaToolbar";

const mockFolders = [
  {
    id: "1",
    name: "Folder 1",
    mediaIds: [],
    children: [],
    counts: { image: 0, video: 0, gif: 0 },
  },
  {
    id: "2",
    name: "Folder 2",
    mediaIds: [],
    children: [],
    counts: { image: 0, video: 0, gif: 0 },
  },
] as Folder[];

describe("MediaToolbar", () => {
  it("renders selected count correctly", () => {
    render(
      <MediaToolbar
        selectedCount={3}
        folders={mockFolders}
        currentFolder={mockFolders[0]}
        onMoveMedia={vi.fn()}
        searchQuery=""
        onSearchChange={vi.fn()}
      />
    );

    expect(screen.getByText("3 selected")).toBeInTheDocument();
  });

  describe("when media is selected", () => {
    it("renders folder select dropdown", () => {
      render(
        <MediaToolbar
          selectedCount={2}
          folders={mockFolders}
          currentFolder={mockFolders[0]}
          onMoveMedia={vi.fn()}
          searchQuery=""
          onSearchChange={vi.fn()}
        />
      );

      expect(screen.getByRole("combobox")).toBeInTheDocument();
      expect(screen.getByText("Folder 1")).toBeInTheDocument();
      expect(screen.getByText("Folder 2")).toBeInTheDocument();
    });
  });

  describe("when selecting a folder", () => {
    it("calls onMoveMedia when selecting a folder", () => {
      const onMoveMediaMock = vi.fn();
      render(
        <MediaToolbar
          selectedCount={2}
          folders={mockFolders}
          currentFolder={mockFolders[0]}
          onMoveMedia={onMoveMediaMock}
          searchQuery=""
          onSearchChange={vi.fn()}
        />
      );

      fireEvent.change(screen.getByRole("combobox"), {
        target: { value: "2" },
      });
      expect(onMoveMediaMock).toHaveBeenCalledWith("2");
    });
  });

  it("updates search query on input change", () => {
    const onSearchChangeMock = vi.fn();
    render(
      <MediaToolbar
        selectedCount={0}
        folders={mockFolders}
        currentFolder={mockFolders[0]}
        onMoveMedia={vi.fn()}
        searchQuery=""
        onSearchChange={onSearchChangeMock}
      />
    );

    fireEvent.change(screen.getByPlaceholderText("Search by name..."), {
      target: { value: "test" },
    });

    expect(onSearchChangeMock).toHaveBeenCalledWith("test");
  });
});
