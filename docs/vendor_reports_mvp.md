
# Vendor Reports MVP

## Input Validation
- When the input text is `0`, turn it red (likely indicating an error or attention is needed).

## Automatic Totalling for Restocks
- Calculate restocked items and update inventory automatically based on the formula:
  - **Ending Inventory (September)** + **October Restock** = **October Inventory**
  - Example:
    ```
    September Ending Inventory | October Restock | October Inventory
                   5                      5                  10
    ```

## Individual Month Reports
- Report for each month should include:
  - **Starting Inventory (September)** and **Ending Inventory (September)**
  - Example:
    ```
    September Starting Inventory | September Ending Inventory
                     10                              5
    ```

## Item Updates in Monthly Reports
- Read updated item counts and:
  - Pull sold items for that month.
  - Automatically calculate **Gross Sales**, **Consignment**, and **Net Sales**.

- Example of sales report:
  ```
  Vendor  | Item Name       | Units Sold | Gross Sale
  Lauren  | Air Plant Pod   | 1          | $10

  Consignment (30%) | Net Sale
  0.3 * $10         | $7
  ```

## Gross Totals
- The **Net Sales** totals should be rounded up to the nearest dollar if required.

### Notes
- Add more detailed descriptions or formulas for how gross sales, consignment, and net sales are calculated (e.g., a general formula for consignment percentages).
- Consider adding a notes section on how rounding is handled (e.g., round up rules).
