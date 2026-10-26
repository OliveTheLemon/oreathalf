# Sanity Clean Content Studio

Congratulations, you have now installed the Sanity Content Studio, an open-source real-time content editing environment connected to the Sanity backend.

## Upload local images

Create a `studio/.env` file with a Sanity API token that has write access:

```dotenv
SANITY_PROJECT_ID=your-project-id
SANITY_DATASET=production
SANITY_API_TOKEN=your-write-token
```

Then, from the `studio` directory, run the uploader with the image folder path:

```powershell
npm run upload:images -- 'C:\path\to\images'
```

The `.env` file is git-ignored. Keep the token private and do not commit it.

The uploader searches the folder and its subfolders for JPEG, PNG, GIF, WebP, AVIF, and TIFF images. For each image, enter its title (defaults to the filename), ingredient number, category, and optional Instagram URL and alt text. It looks up the matching `ingredient` document, uploads the image asset, and creates an `ingrePhotograph` document in the configured dataset. Review the details and confirm each upload when prompted.

If document creation fails after an image asset uploads, the script reports the asset ID so the asset can be reused or cleaned up in Sanity.

Now you can do the following things:

- [Read “getting started” in the docs](https://www.sanity.io/docs/introduction/getting-started?utm_source=readme)
- [Join the Sanity community](https://www.sanity.io/community/join?utm_source=readme)
- [Extend and build plugins](https://www.sanity.io/docs/content-studio/extending?utm_source=readme)
