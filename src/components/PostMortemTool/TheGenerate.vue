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

  const { start, end, storefront, platform } = variablesStore

  const sql = `
  WITH CTE0 AS (
    SELECT
        COUNT(DISTINCT EXTRACT(HOUR FROM o.order_timestamp)) AS hour,
        DATE(o.order_timestamp) AS date,
        count(*)
    
FROM \`hm_live.orders\` o
    WHERE
        o.code_storefront = 'DE'
        AND DATE(o.order_timestamp) BETWEEN DATE_SUB('${start}', INTERVAL 28 DAY) AND DATE_SUB('${start}', INTERVAL 1 DAY)
    GROUP BY
     date
    HAVING hour > 23
),



 CTE1 AS (    
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
    LEFT JOIN CTE0 ON CTE0.date = DATE(o.order_timestamp) 
      
     
    WHERE
        o.code_storefront = 'DE'
        AND DATE(o.order_timestamp) BETWEEN DATE_SUB('${start}', INTERVAL 28 DAY) AND DATE_SUB('${start}', INTERVAL 1 DAY)
        AND IFNULL(app.source, 'web')  in (${platform})
        AND DATE(o.order_timestamp) NOT IN (SELECT date_holiday FROM  \`prod-data-engineering-real.business_intelligence.national_holidays_de\`)
        AND CTE0.date IS NOT NULL
    GROUP BY
        hour, date, day_of_week_number
),

all_hours AS (

    SELECT h AS hour
    FROM UNNEST(GENERATE_ARRAY(0, 23)) AS h
),

total_off_gmv AS (
    SELECT
        date,
        SUM(GMV) AS total_average_gmv,
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
        total_off_gmv.total_average_gmv as total_avg_gmv,
        CTE1.GMV
    FROM
        CTE1
    JOIN
        total_off_gmv ON CTE1.date = total_off_gmv.date
),

CTE2 AS (
SELECT
    hour,
    day_of_week_number,
    avg(gmv) AS average,
    max(gmv) AS max,
    min(gmv) AS min,
    count(total_avg_gmv) AS days_avg,
    avg(total_avg_gmv) AS average_gmv_euros,
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

CTE29  AS (
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
        o.code_storefront = 'DE'
        AND DATE(o.order_timestamp) =  '${start}'
    AND IFNULL(app.source, 'web') in  (${platform})
    GROUP BY
        hour, date, day_of_week_number
),

defaults AS (
    SELECT
        MAX(date) AS default_date,
        MAX(day_of_week_number) AS default_down
    FROM CTE29
),





CTE3 AS (SELECT
    COALESCE(CTE29.actual_GMV, 0) AS actual_GMV,
    ah.hour,
    COALESCE(CTE29.date, (select default_date FROM defaults)) AS date,  
    COALESCE(CTE29.day_of_week_number, (select default_down FROM defaults)) AS day_of_week_number  
FROM
    all_hours ah
LEFT JOIN
    CTE29 ON CTE29.hour = ah.hour
ORDER BY
    ah.hour
),

total_on_gmv AS (
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
        a.actual_GMV,
        b.total_gmv 
    FROM
        CTE3 a
    JOIN
        total_on_gmv b ON a.date = b.date
),

CTE5 AS (
    SELECT
        a.hour as hours,
        a.actual_GMV as on_h_gmv,
        b.average as off_havg_gmv,
        b.min as off_hmin_gmv,
        b.max as off_hmax_gmv,
        a.total_gmv as on_total_gmv,
        array_gmv,
        array_date,
        array_order,
        days_avg as days_accounted,
    FROM
        NormalizedCTE3 a
    LEFT JOIN
        CTE2 b ON a.hour = b.hour AND a.day_of_week_number = b.day_of_week_number
)

SELECT
*

FROM CTE5
ORDER BY hours ASC;
  
  `;


    
  console.log(sql); 
  variablesStore.setSQL(sql)

  navigator.clipboard.writeText(sql).then(() => {

    alert("Successfully copied to clipboard please execute in BigQuery");
  }).catch(err => {
  
    console.error("Failed to copy text: ", err);
    alert("Failed to copy to clipboard");
  });
}
     
    
    </script>
    
    <style scoped>

    .gen {
        margin-top: 0.5rem;
        width: 100%;
        height: 80%;
        cursor: pointer;
        background-color: rgb(234, 179, 117);
        color: #fff;
        border: none;
        border-radius: 4px;
        font-size: 0.8rem;
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

