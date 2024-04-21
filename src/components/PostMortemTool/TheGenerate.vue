<template>
 <div>
    <button @click="generateSQL" class="gen">generate and copy SQL</button>
</div>

</template>
    
    <script setup>
     import { ref } from 'vue'
      
      import { useVariablesStore } from '@/stores/PostMortem/variables.js' 
      const variablesStore = useVariablesStore()

    
      function generateSQL() {
  // Accessing values from the store
  const { start, end, storefront, platform } = variablesStore

  // Constructing the SQL query string
  const sql = `
  WITH CTE1 AS (
    SELECT
        SUM(total_price / 100) AS GMV,
        EXTRACT(HOUR FROM c.date_inserted) AS hour,
        DATE(c.date_inserted) AS date,
        EXTRACT(DAYOFWEEK FROM c.date_inserted) AS day_of_week_number
    FROM
        \`prod-data-engineering-real.hm_live.checkouts\` c
    LEFT JOIN
        \`prod-data-engineering-real.hm_live.buy_event\` AS app
        ON app.id_pre_checkout = c.id_pre_checkout
    WHERE
        code_storefront = 'DE'
        AND c.date_inserted BETWEEN '2023-02-10' AND '2024-02-11'
        AND IFNULL(app.source, 'web') = 'web'
        AND NOT (
            DATE(c.date_inserted) BETWEEN DATE_SUB('2023-11-24', INTERVAL 7 DAY) AND DATE_ADD('2023-11-24', INTERVAL 7 DAY)
            OR DATE(c.date_inserted) BETWEEN DATE_SUB('2023-12-07', INTERVAL 7 DAY) AND DATE_ADD('2023-12-24', INTERVAL 14 DAY)
            OR DATE(c.date_inserted) BETWEEN DATE_SUB('2024-12-07', INTERVAL 7 DAY) AND DATE_ADD('2024-12-24', INTERVAL 14 DAY)
           
        )
    GROUP BY
        hour, date, day_of_week_number
),

CTE2 AS (
    SELECT
        hour,
        day_of_week_number,
        APPROX_QUANTILES(GMV, 4)[OFFSET(1)] AS Q1,
        APPROX_QUANTILES(GMV, 4)[OFFSET(3)] AS Q3
    FROM
        CTE1
    GROUP BY
        hour, day_of_week_number
),

CTE3 AS (
    SELECT
        hour,
        day_of_week_number,
        Q1,
        Q3,
        (Q3 - Q1) * 1.5 AS IQR
    FROM
        CTE2
),

Filtered_GMV AS (
    SELECT
        a.hour,
        a.day_of_week_number,
        a.GMV
    FROM
        CTE1 a
    JOIN
        CTE3 b
        ON a.hour = b.hour AND a.day_of_week_number = b.day_of_week_number
    WHERE
        a.GMV BETWEEN (b.Q1 - b.IQR) AND (b.Q3 + b.IQR)
),

Adjusted_Aggregates AS (
    SELECT
        hour,
        day_of_week_number,
        AVG(GMV) AS adjusted_average_GMV,
        APPROX_QUANTILES(GMV, 4)[OFFSET(3)] AS highest_non_outlier_value,
        APPROX_QUANTILES(GMV, 4)[OFFSET(1)] AS lowest_non_outlier_value
    FROM
        Filtered_GMV
    GROUP BY
        hour, day_of_week_number
),


actual_cte as (
    SELECT
SUM(total_price / 100) as GMV,
EXTRACT(HOUR FROM c.date_inserted) AS hour,
DATE(c.date_inserted) as date,
EXTRACT(DAYOFWEEK FROM c.date_inserted) AS day_of_week_number

 FROM \`prod-data-engineering-real.hm_live.checkouts\`  c
 LEFT JOIN \`prod-data-engineering-real.hm_live.buy_event\` AS app ON app.id_pre_checkout = c.id_pre_checkout
WHERE code_storefront = '${storefront}'
AND c.date_inserted > '${start}'
AND c.date_inserted < '${end}'
AND IFNULL(app.source, 'web') = '${platform}'
GROUP BY ALL
ORDER BY date, hour ASC
)

SELECT
    adjusted_average_GMV as average_gmv,
    highest_non_outlier_value as Q3,
    lowest_non_outlier_value as Q1,
    actual_cte.GMV as actual_gmv,
    actual_cte.hour as hours,
    actual_cte.date as dates,
FROM
    Adjusted_Aggregates aa
LEFT JOIN
    actual_cte USING (hour,day_of_week_number)
WHERE actual_cte.GMV IS NOT NULL

ORDER BY
    hours;
  `;
    
  console.log(sql); // Logging the SQL to the console
  variablesStore.setSQL(sql)

  navigator.clipboard.writeText(sql).then(() => {
    // This block executes on successful copying
    alert("Successfully copied to clipboard please execute in BigQuery");
  }).catch(err => {
    // This block handles any errors that might occur
    console.error("Failed to copy text: ", err);
    alert("Failed to copy to clipboard");
  });
}
     
    
    </script>
    
    <style scoped>
    
    .gen {
        width: 10rem;
        height:5rem;
        cursor: pointer;
    }
    
    </style>