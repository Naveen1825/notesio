import { atom, selector } from "recoil"

export interface Note {
  id: number
  title: string
  content: string
  createdAt: Date
  space?: string
  spaceColor?: string
}

export interface Space {
  id: string
  name: string
  color: string
  notes: Note[]
}

export const notesState = atom<Note[]>({
  key: "notesState",
  default: [],
})

export const searchQueryState = atom<string>({
  key: "searchQueryState",
  default: "",
})

export const activeTabState = atom<"flows" | "spaces" | "hmmm">({
  key: "activeTabState",
  default: "flows",
})

export const isModalOpenState = atom<boolean>({
  key: "isModalOpenState",
  default: false,
})

export const newNoteState = atom<{ title: string; content: string }>({
  key: "newNoteState",
  default: { title: "", content: "" },
})

export const editingNoteState = atom<Note | null>({
  key: "editingNoteState",
  default: null,
})

export const viewingNoteState = atom<Note | null>({
  key: "viewingNoteState",
  default: null,
})

export const spacesState = atom<Space[]>({
  key: "spacesState",
  default: [],
})

export const filteredNotesSelector = selector<Note[]>({
  key: "filteredNotesSelector",
  get: ({ get }) => {
    const notes = get(notesState)
    const searchQuery = get(searchQueryState)

    if (!searchQuery.trim()) return notes

    return notes.filter(
      (note) =>
        note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        note.content.toLowerCase().includes(searchQuery.toLowerCase()),
    )
  },
})

export const currentViewNotesSelector = selector<Note[]>({
  key: "currentViewNotesSelector",
  get: ({ get }) => {
    const filteredNotes = get(filteredNotesSelector)
    const activeTab = get(activeTabState)

    if (activeTab === "flows") {
      return filteredNotes
    } else if (activeTab === "spaces") {
      return filteredNotes.filter((note) => note.space)
    } else {
      return [] // hmmm tab shows nothing for now
    }
  },
})
