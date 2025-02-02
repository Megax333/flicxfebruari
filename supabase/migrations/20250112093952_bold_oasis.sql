/*
  # Reorder Gaming and Counseling categories

  Updates the order of categories to move Gaming before Counseling
*/

UPDATE categories 
SET "order" = 
  CASE 
    WHEN id = 'gaming' THEN 5
    WHEN id = 'counseling' THEN 6
    ELSE "order"
  END
WHERE id IN ('gaming', 'counseling');