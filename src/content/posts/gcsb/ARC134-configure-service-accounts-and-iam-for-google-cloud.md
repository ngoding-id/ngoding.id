---
title: 'Configure Service Accounts and IAM for Google Cloud: Challenge Lab'
published: 2024-05-25
description: "Challenge lab ini akan membantu kita untuk memahami bagaimana cara membuat service account untuk mengakses BigQuery"
image: 'https://cdn.qwiklabs.com/XJaEWiH%2F0mcRnfEIum7yEQptkSskqzoc10SQwjOjkJE%3D'
tags: ['ARC134', 'The Arcade Level 1 - May 2024']
category: 'Google Cloud Skills Boost'
draft: false 
---

Pada challenge ini, kita diminta untuk membuat `service account`, menetapkan `role` yang diperlukan, mengonfigurasi `IAM permission` menggunakan `gcloud CLI`, membuat `role` khusus menggunakan YAML, dan menggunakan `client library` untuk mengakses BigQuery dari `service account`.

## Task 2. Create a service account using the gcloud CLI

Pada lab ini, instance Compute Engine dengan nama `lab-vm` telah disediakan. Kita akan menggunakan instance ini untuk menyelesaikan challenge ini.

1. Buka daftar compute instance dengan membuka `Navigation Menu` > `Compute Engine` > `VM instances`.
2. Pada baris dengan instance bernama `lab-vm`, klik `SSH`.
3. Mulai mengonfigurasi environment gcloud. Di dalam sesi SSH, jalankan:
    ```bash
    gcloud auth login --no-launch-browser
    ```

    Kita akan mendapatkan URL untuk login. Salin URL tersebut dan buka di browser. Setelah login, salin kode verifikasi dan paste di terminal SSH.
4. Buat service account dengan nama `devops`:
    ```bash
    gcloud iam service-accounts create devops --display-name devops
    ```
5. Jika sudah selesai, tekan `Check my progress` pada GCSB untuk melanjutkan.

## Task 3. Grant IAM permissions to a service account using the gcloud CLI

1. Karena kita akan menggunakan project id dan service account beberapa kali, maka sebaiknya kita mengekspor project id dan service account ke dalam variabel lokal yang akan kita gunakan nantinya:
    ```bash
    export PROJECTID=$(gcloud config get-value project)
    ```
2. Sama seperti sebelumnya, ekspor service account ke dalam variabel lokal dengan nama `SA`:
    ```bash
    gcloud iam service-accounts list  --filter "displayName=devops"
    SA=$(gcloud iam service-accounts list --format="value(email)" --filter "displayName=devops")
    ```
3. Berikan role `iam.serviceAccountUser` dengan permission `compute.instanceAdmin` ke service account `devops`:
    ```bash
    gcloud projects add-iam-policy-binding $PROJECTID --member serviceAccount:$SA --role=roles/iam.serviceAccountUser
    gcloud projects add-iam-policy-binding $PROJECTID --member serviceAccount:$SA --role=roles/compute.instanceAdmin
    ```
4. Jika sudah selesai, tekan `Check my progress` pada GCSB untuk melanjutkan.

## Task 4. Create a compute instance with a service account attached using gcloud

Untuk task ini, VM bernama `lab-vm` telah disediakan. SSH ke VM `lab-vm` untuk memulai. Buat instance bernama `vm-2` dengan service account `devops` yang kita buat pada task 2:

```bash
gcloud compute instances create vm-2 \
    --service-account=$SA \
    --zone=$ZONE
```

Jika sudah selesai, tekan `Check my progress` pada GCSB untuk melanjutkan.

## Task 5. Create a custom role using a YAML file

1. Buat YAML file dengan nama `role-definition.yaml` yang memiliki custom role dengan permission `cloudsql.instances.connect` dan `cloudsql.instances.get`:
    ```bash
    cat > role-definition.yaml <<EOF
    title: Custom Role
    description: Custom role with cloudsql.instances.connect and cloudsql.instances.get permissions
    includedPermissions:
    - cloudsql.instances.connect
    - cloudsql.instances.get
    EOF
    ```
2. Jalankan command gcloud untuk membuat role pada level project menggunakan YAML file:
    ```bash
    gcloud iam roles create customRole --project=$PROJECTID --file=role-definition.yaml
    ```
3. Jika sudah selesai, tekan `Check my progress` pada GCSB untuk melanjutkan.

## Task 6. Use the client libraries to access BigQuery from a service account

Untuk tugas ini, kita akan melakukan query terhadap dataset publik BigQuery dari suatu instance dengan bantuan service account yang telah dikonfigurasi roles yang diperlukan.

1. Buat service account dengan nama `bigquery-qwiklab` dan berikan role `BigQuery Data Viewer` sebagai `BigQuery User`:
    ```bash
    gcloud iam service-accounts create bigquery-qwiklab --display-name bigquery-qwiklab
    SSA=$(gcloud iam service-accounts list --format="value(email)" --filter "displayName=bigquery-qwiklab")
    gcloud projects add-iam-policy-binding $PROJECTID --member=serviceAccount:$SSA --role=roles/bigquery.dataViewer
    gcloud projects add-iam-policy-binding $PROJECTID --member=serviceAccount:$SSA --role=roles/bigquery.user
    ```
2. Buat VM instance dengan nama `bigquery-instance` dengan service account `bigquery-qwiklab`:
    ```bash
    gcloud compute instances create bigquery-instance --service-account=$SSA --scopes=https://www.googleapis.com/auth/bigquery --zone=$ZONE
    ```
3. SSH ke instance `bigquery-instance` dan install dependencies yang dibutuhkan:
    ```bash
    export PROJECT_ID=$(gcloud config get-value project)
    sudo apt-get update
    sudo apt-get install -y git python3-pip
    pip3 install --upgrade pip
    pip3 install google-cloud-bigquery
    pip3 install pyarrow
    pip3 install pandas
    pip3 install db-dtypes
    ```
4. Jalankan command berikut untuk membuat python file:
    ```bash
    echo "
    from google.auth import compute_engine
    from google.cloud import bigquery
    credentials = compute_engine.Credentials(
        service_account_email='bigquery-qwiklab@$PROJECT_ID.iam.gserviceaccount.com')
    query = '''
    SELECT name, SUM(number) as total_people
    FROM "bigquery-public-data.usa_names.usa_1910_2013"
    WHERE state = 'TX'
    GROUP BY name, state
    ORDER BY total_people DESC
    LIMIT 20
    '''
    client = bigquery.Client(
        project='$PROJECT_ID',
        credentials=credentials)
    print(client.query(query).to_dataframe())
    " > query.py
    ```
5. Jalankan script python yang telah dibuat:
    ```bash
    python3 query.py
    ```
6. Jika sudah selesai, tekan `Check my progress` pada GCSB untuk menyelesaikan challenge ini.

Selamat! Kita telah menyelesaikan challenge lab `Configure Service Accounts and IAM for Google Cloud: Challenge Lab`.

> ### Useful Links:
> - [Configure Service Accounts and IAM for Google Cloud: Challenge Lab](https://www.cloudskillsboost.google/course_templates/702/labs/461623)