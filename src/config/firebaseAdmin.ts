import admin, { ServiceAccount } from "firebase-admin";

const serviceAccount = {
  type: "service_account",
  project_id: "first-app-c0fae",
  private_key_id: "c62f2ef356fa7610930e10df263c8bc382c502db",
  private_key:
    "-----BEGIN PRIVATE KEY-----\nMIIEvwIBADANBgkqhkiG9w0BAQEFAASCBKkwggSlAgEAAoIBAQDA9feGceyAtgfr\ncbAkSYkVuP5piMrLE0VwqzZ1YUmq2XOWZKn3B/mIz+EOpTtOEPTyXTjuOQfXjidC\n7PHKnanqEEar3J1h8ZWnC7oBxuYdEph8tTuAPhejrvH9KPNP7uDBIOp1Gh6uwRWR\nOkAmoMDusLKj7u7VSM+/xtb88Zitc1rqBdyu5vOzYb5roASuTiE84lLlMpjcIHAO\n+9NxYSOAHZ7lNJuwIGfQbCfC+1tLEjfSBew7XwdgZgkxFLXYQwiNa1r9N1FGCvgx\nbjFgWA98wE1dNM3ZcKxrwGGwUe0s3Z4cXdN+mvqukldnzlbzMgkTVaJY1gdy6Nxh\nwqog65dHAgMBAAECggEAOKL5eDjQFidXw7+m17/NwNZ/tjI0c87APwXCAkn/+WnC\nB46cZKmukH2TrVzKP2uyucCrCSEsMBTFaVtqzPHiAZWtaJxkhW8HYfSLMCJVQItI\nvrHjOQ0Am0aqOIhggkG3Lnie2KhGAT0jO3FBixT8DBNJG9zxtSCd+cg/KhcvnRkQ\nCkc0NM11wzy0U130K9UfnA/J8Zzc8hz1QHAy8ER+qNMkiIaPZYWfs/8eRJSOqdCR\ngnUMa2eCPFBVm28/RmiROvgEu8vhGWfWLRGxEyw1LhUxiwL+xebIcjYkKfh+hvcX\nRzgldoY1yfZ3peJlqE/M3RByIoyQ/ZaqSsVYEokFgQKBgQDsVbi6ZQ0nkevLiGjv\nK9tSXgsS7IVJdfcjF34ei7Um1yOgUR37GX/Kr771+oPduwgofKibHyrBGFFekc1z\nNJuuR9rhN5R6bmp7mevQ1Z3Yy8mNfRVz4V2nAEIZffuAP9W4lXnb16cUNr/XGYYF\n2qL9VHajTMG/l5YZk2YCy2p5kQKBgQDRBFCPoUqQqNqegvBKIjz/FZKojn3zlboN\nEWV+YTv/dsDbV6COb0Y0+zdAiGOk+iTYaNBekn1y5MQZPphMhMfG0jDRqbvLOGSa\nw2AekvYmXw8irJXTVFxK4FwTEW422Qv3ORIcnSmAk6j1JhBf29porggoDOUfNfwL\njqVwc6xXVwKBgQC3nepGN1i/E6plmfgdSq++EP79lvH/nz2B8DC2vsjiAmjVl/B5\nNNiKu3zcU+S8EyJFgoTk8JQhLimaFiHPjmIeSAmQzcP4U2071tzWhgF7fOl9ml9e\nhwxiQdsZPz516CK+pLPm0GgpVlg6YMQ2LCZSOJtsSKiHmNivykuJhE2XYQKBgQDA\nduOjzlZ17DYa/eE7sllOXdQFB+issrN2Mw2tGOYBb51YnFDIt2gDg0u2TaDLmlbx\nO1qbqvJ/KG31/PCKjT3UM1omxc+Z6pyg8cUBgjvMy32JZTg1N5ogjIXcPRGqyaO+\nCzxFQuajcdSDoIA1dKGiAJacInuciL5E+h4W9Ty90wKBgQCrMUrijvQC/cpjVyso\nvFIc++b9k3zD3pTt3h+EEZ6cpGDu6/FJXPwHdabIhnVp5XkLRi6lsKlNwKZpZ6bD\n43bTnOl2gY3CnAvN4JZ01sGxlHRBT/Z7fqzn9rRP8N/lkjBazqc2De3BP+8F6QAD\nZCrNDh/Unp0bacxLIY/I/xyOhQ==\n-----END PRIVATE KEY-----\n",
  client_email:
    "firebase-adminsdk-ury9w@first-app-c0fae.iam.gserviceaccount.com",
  client_id: "115592555626905975262",
  auth_uri: "https://accounts.google.com/o/oauth2/auth",
  token_uri: "https://oauth2.googleapis.com/token",
  auth_provider_x509_cert_url: "https://www.googleapis.com/oauth2/v1/certs",
  client_x509_cert_url:
    "https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-ury9w%40first-app-c0fae.iam.gserviceaccount.com",
};

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount as ServiceAccount),
  databaseURL:
    "https://first-app-c0fae-default-rtdb.europe-west1.firebasedatabase.app",
});

export default admin;
