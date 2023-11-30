-- CreateTable
CREATE TABLE "Article" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "author_id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "body" TEXT NOT NULL,
    "new_revision_id" INTEGER,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "deleted_at" DATETIME,
    CONSTRAINT "Article_author_id_fkey" FOREIGN KEY ("author_id") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Article_new_revision_id_fkey" FOREIGN KEY ("new_revision_id") REFERENCES "Article" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Attachment" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "articleId" INTEGER NOT NULL,
    "body" BLOB NOT NULL,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "modified_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Attachment_articleId_fkey" FOREIGN KEY ("articleId") REFERENCES "Article" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "Article_new_revision_id_key" ON "Article"("new_revision_id");

-- CreateIndex
CREATE INDEX "Article_deleted_at_title_created_at_idx" ON "Article"("deleted_at", "title", "created_at");

-- CreateIndex
CREATE INDEX "Article_new_revision_id_deleted_at_title_idx" ON "Article"("new_revision_id", "deleted_at", "title");

-- CreateIndex
CREATE INDEX "Article_new_revision_id_deleted_at_created_at_idx" ON "Article"("new_revision_id", "deleted_at", "created_at");

-- CreateIndex
CREATE INDEX "Attachment_articleId_idx" ON "Attachment"("articleId");
