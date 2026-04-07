-- User dummy data (All passwords are "password123")
INSERT INTO users (id, email, first_name, last_name, user_account, password_hash) VALUES
(1, 'alice@example.com', 'Alice', 'Smith', 'alicesmith', '$argon2id$v=19$m=65536,t=3,p=4$cnpqRTcMUXoQO2V4Fo/+bg$entHrDJPT5qM5CYrzGI2HhsA+IgBUzLaUpQsRSLjPr8'),
(2, 'bob@example.com', 'Bob', 'Jones', 'bobjones', '$argon2id$v=19$m=65536,t=3,p=4$cnpqRTcMUXoQO2V4Fo/+bg$entHrDJPT5qM5CYrzGI2HhsA+IgBUzLaUpQsRSLjPr8'),
(3, 'charlie@example.com', 'Charlie', 'Brown', 'charlieb', '$argon2id$v=19$m=65536,t=3,p=4$cnpqRTcMUXoQO2V4Fo/+bg$entHrDJPT5qM5CYrzGI2HhsA+IgBUzLaUpQsRSLjPr8');
SELECT setval('users_id_seq', 3);

-- Board dummy data
INSERT INTO boards (id, title, owner_id) VALUES
(1, 'Project Alpha', 1),
(2, 'Groceries & Home', 1),
(3, 'Development Sprint', 2);
SELECT setval('boards_id_seq', 3);

-- Board members (Who can see what boards)
INSERT INTO board_members (board_id, user_id, role) VALUES
(1, 1, 'owner'),
(1, 2, 'member'),
(2, 1, 'owner'),
(3, 2, 'owner'),
(3, 3, 'member');

-- Lists (Columns in the board)
INSERT INTO lists (id, board_id, title, position) VALUES
(1, 1, 'To Do', 1),
(2, 1, 'In Progress', 2),
(3, 1, 'Done', 3),
(4, 2, 'Shopping', 1),
(5, 2, 'Chores', 2);
SELECT setval('lists_id_seq', 5);

-- Cards (Items inside the columns)
INSERT INTO cards (id, list_id, title, description, position) VALUES
(1, 1, 'Design Database Schema', 'Draw out the ERD diagram.', 1),
(2, 1, 'Setup FastAPI Backend', 'Initialize the repo and dependencies.', 2),
(3, 2, 'Implement Login Flow', 'React context and JWT integration.', 1),
(4, 4, 'Buy Milk', '2% Milk please.', 1),
(5, 4, 'Buy Eggs', 'Dozen free range.', 2),
(6, 5, 'Vacuum the living room', NULL, 1);
SELECT setval('cards_id_seq', 6);

-- Card Assignees
INSERT INTO card_assignees (card_id, user_id) VALUES
(1, 1),
(2, 2),
(3, 1);

-- Subtasks (Tasks inside a specific card)
INSERT INTO tasks (id, card_id, content, is_completed, position) VALUES
(1, 1, 'Users table', TRUE, 1),
(2, 1, 'Boards table', TRUE, 2),
(3, 1, 'Tasks table', FALSE, 3),
(4, 3, 'Create AuthContext', TRUE, 1),
(5, 3, 'Update ProtectedRoute', TRUE, 2);
SELECT setval('tasks_id_seq', 5);

-- Labels
INSERT INTO labels (id, board_id, name, color) VALUES
(1, 1, 'High Priority', '#ef4444'),
(2, 1, 'Backend', '#3b82f6'),
(3, 1, 'Frontend', '#10b981');
SELECT setval('labels_id_seq', 3);

-- Card Labels
INSERT INTO card_labels (card_id, label_id) VALUES
(1, 1),
(1, 2),
(2, 2),
(3, 3);
