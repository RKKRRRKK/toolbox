<template>
 <div>
    <button @click="generateSQL" class="gen">Get SQL</button>
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
        SUM(o.total_price / 100) AS GMV,
        EXTRACT(HOUR FROM o.order_timestamp) AS hour,
        DATE(o.order_timestamp) AS date,
        EXTRACT(DAYOFWEEK FROM o.order_timestamp) AS day_of_week_number
    FROM
        \`prod-data-engineering-real.hm_live.orders\` o
    LEFT JOIN 
         \`prod-data-engineering-real.hm_live.checkouts\` c ON c.id_checkout = o.id_checkout
    LEFT JOIN
        \`prod-data-engineering-real.hm_live.buy_event\` AS app
        ON app.id_pre_checkout = c.id_pre_checkout
      
     
    WHERE
        o.code_storefront = '${storefront}'
        AND DATE(o.order_timestamp) BETWEEN DATE_SUB('${start}', INTERVAL 28 DAY) AND DATE_SUB('${start}', INTERVAL 1 DAY)
        AND IFNULL(app.source, 'web')  in (${platform})
        AND DATE(o.order_timestamp) NOT IN (SELECT date_holiday FROM  \`prod-data-engineering-real.business_intelligence.national_holidays_de\`)
    GROUP BY
        hour, date, day_of_week_number
),

TotalAverageGMVPerDate AS (
    SELECT
        date,
        SUM(GMV) AS total_average_gmv
    FROM
        CTE1
    GROUP BY
        date
),

NormalizedCTE1 AS (
    SELECT
        CTE1.hour,
        CTE1.day_of_week_number,
        CTE1.date,
        CTE1.GMV / TotalAverageGMVPerDate.total_average_gmv * 100 AS normalized_average_gmv,
        CTE1.GMV
    FROM
        CTE1
    JOIN
        TotalAverageGMVPerDate ON CTE1.date = TotalAverageGMVPerDate.date
),

CTE2 AS (
SELECT
    hour,
    day_of_week_number,
    avg(normalized_average_gmv) AS average,
    max(normalized_average_gmv) AS max,
    min(normalized_average_gmv) AS min,
    count(normalized_average_gmv) AS days_avg,
    avg(gmv) AS average_gmv_euros,
    ARRAY_AGG(ROUND(gmv)) AS array_gmv,
    ARRAY_AGG(date) AS array_date,
    ARRAY_AGG(row_number) AS array_order
FROM (
    SELECT
        *,
        ROW_NUMBER() OVER (PARTITION BY day_of_week_number, hour ORDER BY date ASC) AS row_number
    FROM NormalizedCTE1
)
    GROUP BY
        hour, day_of_week_number
),

CTE3 AS (
    SELECT
        SUM(o.total_price / 100) AS actual_GMV,
        EXTRACT(HOUR FROM o.order_timestamp) AS hour,
        DATE(o.order_timestamp) AS date,
        EXTRACT(DAYOFWEEK FROM o.order_timestamp) AS day_of_week_number
    FROM
        \`prod-data-engineering-real.hm_live.orders\` o
    LEFT JOIN 
         \`prod-data-engineering-real.hm_live.checkouts\` c ON c.id_checkout = o.id_checkout
    LEFT JOIN
        \`prod-data-engineering-real.hm_live.buy_event\` AS app
        ON app.id_pre_checkout = c.id_pre_checkout
    WHERE
        o.code_storefront = '${storefront}'
        AND DATE(o.order_timestamp) = '${start}'
    AND IFNULL(app.source, 'web') in (${platform})
    GROUP BY
        hour, date, day_of_week_number
),

TotalGMVOnDate AS (
    SELECT
        date,
        SUM(actual_GMV) AS total_gmv
    FROM
        CTE3
    GROUP BY
        date
),

NormalizedCTE3 AS (
    SELECT
        a.hour,
        a.day_of_week_number,
        a.date,
        a.actual_GMV / b.total_gmv * 100 AS normalized_actual_gmv,
        a.actual_GMV,
        b.total_gmv as total_actual_gmv
    FROM
        CTE3 a
    JOIN
        TotalGMVOnDate b ON a.date = b.date
),

CTE5 AS (
    SELECT
        a.date,
        a.hour as hours,
        a.day_of_week_number,
        a.normalized_actual_gmv as actual_gmv,
        b.average AS average_gmv,
        b.max,
        b.min,
        b.days_avg as days_accounted,
        ((b.average / a.normalized_actual_gmv) * a.actual_GMV) - a.actual_GMV as avg_loss,
        ((b.max / a.normalized_actual_gmv) * a.actual_GMV) - a.actual_GMV as max_loss,
        ((b.min / a.normalized_actual_gmv) * a.actual_GMV) - a.actual_GMV as min_loss,
        a.actual_GMV as actual_gmv_euros,
        ((b.average / a.normalized_actual_gmv) * a.actual_GMV) as average_gmv_euros,
        total_actual_gmv,
        b.array_gmv,
        b.array_date,
        b.array_order
    FROM
        NormalizedCTE3 a
    LEFT JOIN
        CTE2 b ON a.hour = b.hour AND a.day_of_week_number = b.day_of_week_number
)

SELECT
average_gmv,
max,
min,
actual_gmv,
hours,
avg_loss,
max_loss,
min_loss,
actual_gmv_euros,
average_gmv_euros,
total_actual_gmv / 100 as gmv_part,
days_accounted,
array_gmv,
array_date,
array_order,

FROM CTE5
ORDER BY hours ASC;

  

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
        margin-top: 1rem;
        width: 6rem;
        height: 3rem;
        cursor: pointer;
        background-color: rgb(233, 171, 100);
        color: #fff;
        border: none;
        border-radius: 4px;
        font-size: 1rem;
        font-weight: bold;
        letter-spacing: 1px;
        transition: background-color 0.3s ease;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    }
    
    .gen:hover {
        background-color: rgba(237, 150, 50, 1);
    }
    
    .gen:active {
        background-color: rgb(82, 50, 14);
        box-shadow: none;
        transform: translateY(1px);
    }
    </style>

<!-- WHERE code_storefront = '${storefront}'
AND c.date_inserted > '${start} 00:00:00 UTC'
AND c.date_inserted < '${end} 23:59:59 UTC'
AND IFNULL(app.source, 'web') = '${platform}' -->  