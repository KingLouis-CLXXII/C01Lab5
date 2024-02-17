test("1+2=3, empty array is empty", () => {
  expect(1 + 2).toBe(3);
  expect([].length).toBe(0);
});

const SERVER_URL = "http://localhost:4000";

async function createTestNote() {
  const response = await fetch(`${SERVER_URL}/postNote`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      title: "Test Note",
      content: "This is a test note.",
    }),
  });
  const body = await response.json();
  return body;
}

beforeEach(async () => {
  await fetch(`${SERVER_URL}/deleteAllNotes`, { method: "DELETE" });
});

test("/postNote - Post a note", async () => {
  const title = "NoteTitleTest";
  const content = "NoteTitleContent";

  const postNoteRes = await fetch(`${SERVER_URL}/postNote`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      title: title,
      content: content,
    }),
  });

  const postNoteBody = await createTestNote();

  expect(postNoteRes.status).toBe(200);
  expect(postNoteBody.response).toBe("Note added succesfully.");
});

test("/getAllNotes - Return list of zero notes for getAllNotes", async () => {
  const response = await fetch(`${SERVER_URL}/getAllNotes`);
  const body = await response.json();

  expect(response.status).toBe(200);
  expect(body.response).toEqual([]);
});

test("/getAllNotes - Return list of two notes for getAllNotes", async () => {
  await createTestNote();
  await createTestNote();
  const response = await fetch(`${SERVER_URL}/getAllNotes`);
  const body = await response.json();

  expect(response.status).toBe(200);
  expect(body.response.length).toBe(2);
});

test("/deleteNote - Delete a note", async () => {
  const noteId = await createTestNote();
  const response = await fetch(`${SERVER_URL}/deleteNote/${noteId}`, { method: "DELETE" });
  const body = await response.json();

  expect(response.status).toBe(200);
  expect(body.response).toContain(noteId);  
});

test("/patchNote - Patch with content and title", async () => {
  const noteId = createTestNote();
  const newTitle = "Updated Title";
  const newContent = "Updated Content";

  const response = await fetch(`${SERVER_URL}/patchNote/${noteId}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ title: newTitle, content: newContent }),
  });
  const body = await response.json();

  expect(response.status).toBe(200);
  expect(body.response).toContain(noteId);
  expect(title).toBe(newTitle);
  expect(content).toBe(newContent);
});

test("/patchNote - Patch with just title", async () => {
  const noteId = createTestNote();
  const newTitle = "Updated Title";

  const response = await fetch(`${SERVER_URL}/patchNote/${noteId}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ title: newTitle }),
  });
  const body = await response.json();

  expect(response.status).toBe(200);
  expect(body.response).toContain(noteId);
  expect(title).toBe(newTitle);
});

test("/patchNote - Patch with just content", async () => {
  const noteId = createTestNote();
  const newContent = "Updated Content";

  const response = await fetch(`${SERVER_URL}/patchNote/${noteId}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ content: newContent }),
  });
  const body = await response.json();

  expect(response.status).toBe(200);
  expect(body.response).toContain(noteId);
  expect(content).toBe(newContent);
});

test("/deleteAllNotes - Delete one note", async () => {
  await createTestNote();
  const response = await fetch(`${SERVER_URL}/deleteAllNotes`, { method: "DELETE" });
  const body = await response.json();

  expect(response.status).toBe(200);
});

test("/deleteAllNotes - Delete three notes", async () => {
  await createTestNote();
  await createTestNote();
  await createTestNote();
  const response = await fetch(`${SERVER_URL}/deleteAllNotes`, { method: "DELETE" });
  const body = await response.json();

  expect(response.status).toBe(200);
});

test("/updateNoteColor - Update color of a note to red (#FF0000)", async () => {
  const noteId = createTestNote();
  const color = "#FFFFFF";

  const response = await fetch(`${SERVER_URL}/updateNoteColor/${noteId}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ color }),
  });
  const body = await response.json();

  expect(response.status).toBe(200);
  expect(body.message).toBe("Note color updated successfully.");
});