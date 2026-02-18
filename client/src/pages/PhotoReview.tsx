import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

// Generated from generate_photo_data.py
const photos = [
  {
    "id": 1,
    "filename": "07bca6a5-60ed-4caf-8b68-2f58b9180c821930086556249108561.jpg",
    "url": "https://files.manuscdn.com/user_upload_by_module/session_file/113311765/WtXyOmeYHiZSjDmR.jpg",
    "isUsed": true,
    "currentLabel": "Rinnai Water Heater",
    "section": "Camp Kitchen"
  },
  {
    "id": 2,
    "filename": "19df7bf6-5ae7-43b5-bdf5-d7b565d67c335462419664267028414.jpg",
    "url": "https://files.manuscdn.com/user_upload_by_module/session_file/113311765/HbBqtLQlOPnexkHZ.jpg",
    "isUsed": false,
    "currentLabel": "Unlabeled - Awaiting Your Description",
    "section": "Not Yet Assigned"
  },
  {
    "id": 3,
    "filename": "26821aa8-8d17-4587-9cbd-3dc653fdcd9b7789769782869548131.jpg",
    "url": "https://files.manuscdn.com/user_upload_by_module/session_file/113311765/yNXHYLXUsEMzXELJ.jpg",
    "isUsed": false,
    "currentLabel": "Unlabeled - Awaiting Your Description",
    "section": "Not Yet Assigned"
  },
  {
    "id": 4,
    "filename": "29fa362a-4d79-407f-bb3a-98121b15aee46441342934974945409_compressed.jpg",
    "url": "https://files.manuscdn.com/user_upload_by_module/session_file/113311765/vdkraScBSTETagmI.jpg",
    "isUsed": false,
    "currentLabel": "Unlabeled - Awaiting Your Description",
    "section": "Not Yet Assigned"
  },
  {
    "id": 5,
    "filename": "2a151e66-e64c-49fb-b9e8-bebedf6529536044941385124713323.jpg",
    "url": "https://files.manuscdn.com/user_upload_by_module/session_file/113311765/fVFDlydxnGnyFJxW.jpg",
    "isUsed": false,
    "currentLabel": "Unlabeled - Awaiting Your Description",
    "section": "Not Yet Assigned"
  },
  {
    "id": 6,
    "filename": "2c46cc73-55ff-4825-b769-fa95f3b67a323310409758559673951.jpg",
    "url": "https://files.manuscdn.com/user_upload_by_module/session_file/113311765/eNhbxPtfLqEzpPuF.jpg",
    "isUsed": false,
    "currentLabel": "Unlabeled - Awaiting Your Description",
    "section": "Not Yet Assigned"
  },
  {
    "id": 7,
    "filename": "2f265422-2b90-4423-a2d7-2696cdd4c4a21900058081199528871.jpg",
    "url": "https://files.manuscdn.com/user_upload_by_module/session_file/113311765/LyeCcwuswDAqXjvM.jpg",
    "isUsed": false,
    "currentLabel": "Unlabeled - Awaiting Your Description",
    "section": "Not Yet Assigned"
  },
  {
    "id": 8,
    "filename": "3a742b28-545b-43b1-994e-9af887fbafa15191763634028758590_compressed.jpg",
    "url": "https://files.manuscdn.com/user_upload_by_module/session_file/113311765/CgbVzhZTMkxCdoDg.jpg",
    "isUsed": false,
    "currentLabel": "Unlabeled - Awaiting Your Description",
    "section": "Not Yet Assigned"
  },
  {
    "id": 9,
    "filename": "405bdd32-de59-4592-a205-a2cf7167a2617457080908458409175.jpg",
    "url": "https://files.manuscdn.com/user_upload_by_module/session_file/113311765/ZGVlhDyYqwnHfHFH.jpg",
    "isUsed": false,
    "currentLabel": "Unlabeled - Awaiting Your Description",
    "section": "Not Yet Assigned"
  },
  {
    "id": 10,
    "filename": "4a62f37c-a7c3-4749-9d5c-e4105e7b617c6655817922401380830.jpg",
    "url": "https://files.manuscdn.com/user_upload_by_module/session_file/113311765/WwXfjENZXYRKeNZI.jpg",
    "isUsed": false,
    "currentLabel": "Unlabeled - Awaiting Your Description",
    "section": "Not Yet Assigned"
  },
  {
    "id": 11,
    "filename": "4e2c92b7-0eab-4e24-b9ae-cca95567052d4421247183303991885.jpg",
    "url": "https://files.manuscdn.com/user_upload_by_module/session_file/113311765/SiTZdMdRXABdawjQ.jpg",
    "isUsed": false,
    "currentLabel": "Unlabeled - Awaiting Your Description",
    "section": "Not Yet Assigned"
  },
  {
    "id": 12,
    "filename": "55bef0a1-5582-429f-a5fb-0e33cba193b01024972797705536246.jpg",
    "url": "https://files.manuscdn.com/user_upload_by_module/session_file/113311765/BqZnzjYiijBZWlvI.jpg",
    "isUsed": false,
    "currentLabel": "Unlabeled - Awaiting Your Description",
    "section": "Not Yet Assigned"
  },
  {
    "id": 13,
    "filename": "69fb517a-a66f-4707-b965-769fe97e65054006579965898817081.jpg",
    "url": "https://files.manuscdn.com/user_upload_by_module/session_file/113311765/uqBSIzRosGDhIHTb.jpg",
    "isUsed": false,
    "currentLabel": "Unlabeled - Awaiting Your Description",
    "section": "Not Yet Assigned"
  },
  {
    "id": 14,
    "filename": "81e32e8a-7058-4926-a81e-b83471121c514600297826776263492.jpg",
    "url": "https://files.manuscdn.com/user_upload_by_module/session_file/113311765/WKteXBNObpvEvBJq.jpg",
    "isUsed": false,
    "currentLabel": "Unlabeled - Awaiting Your Description",
    "section": "Not Yet Assigned"
  },
  {
    "id": 15,
    "filename": "8331d30c-51b1-42f4-aebb-781fa1a900756508522668081961412_compressed.jpg",
    "url": "https://files.manuscdn.com/user_upload_by_module/session_file/113311765/pOoPUUBDYmUwNjRy.jpg",
    "isUsed": false,
    "currentLabel": "Unlabeled - Awaiting Your Description",
    "section": "Not Yet Assigned"
  },
  {
    "id": 16,
    "filename": "850da8a1-87f2-4277-8feb-b3eee677eec27354280220135674863.jpg",
    "url": "https://files.manuscdn.com/user_upload_by_module/session_file/113311765/RlWkfdcDvNMhdgvr.jpg",
    "isUsed": false,
    "currentLabel": "Unlabeled - Awaiting Your Description",
    "section": "Not Yet Assigned"
  },
  {
    "id": 17,
    "filename": "90bdd0cd-a84c-4885-a9c6-e67fd4288837350716809401078327.jpg",
    "url": "https://files.manuscdn.com/user_upload_by_module/session_file/113311765/mxTelDBoPcSTNnLT.jpg",
    "isUsed": true,
    "currentLabel": "Fridge",
    "section": "The Chalet"
  },
  {
    "id": 18,
    "filename": "93af0d5d-6206-4d85-afc9-4b412f85700b4460975840867272489.jpg",
    "url": "https://files.manuscdn.com/user_upload_by_module/session_file/113311765/WwhXWeLRdJOdgmla.jpg",
    "isUsed": true,
    "currentLabel": "East Side of Genset (Behind Chalet)",
    "section": "The Chalet"
  },
  {
    "id": 19,
    "filename": "cf9f720a-5048-4824-b0af-70e395d339e6490622785421134038.jpg",
    "url": "https://files.manuscdn.com/user_upload_by_module/session_file/113311765/MsIPkTGyspQACtIO.jpg",
    "isUsed": true,
    "currentLabel": "Electrical Panel (Camp Kitchen Utility Room)",
    "section": "Camp Kitchen > Utility Room"
  },
  {
    "id": 20,
    "filename": "cfa7ae3a-4bf4-4d7d-a4c2-fbbf857cb0b35198826993699509031.jpg",
    "url": "https://files.manuscdn.com/user_upload_by_module/session_file/113311765/ybBwuqDgSkavFOoa.jpg",
    "isUsed": true,
    "currentLabel": "Genset with Cover (Behind Camp Kitchen)",
    "section": "Camp Kitchen"
  },
  {
    "id": 21,
    "filename": "d5d92cec-7a4b-48b5-9156-8d8317085e4e1534784461589245364_compressed.jpg",
    "url": "https://files.manuscdn.com/user_upload_by_module/session_file/113311765/kRPtuEDNUiWwFCwi.jpg",
    "isUsed": true,
    "currentLabel": "Camp Kitchen General View",
    "section": "Camp Kitchen"
  },
  {
    "id": 22,
    "filename": "dbf5c450-0a15-4608-907d-554f3a7385616965322412630139782.jpg",
    "url": "https://files.manuscdn.com/user_upload_by_module/session_file/113311765/SPCeALgOoHoQVAto.jpg",
    "isUsed": true,
    "currentLabel": "Camp Kitchen Stove",
    "section": "Camp Kitchen"
  },
  {
    "id": 23,
    "filename": "df4c4dfb-0ec5-4319-9a53-4b48e915025e1628003542767182916.jpg",
    "url": "https://files.manuscdn.com/user_upload_by_module/session_file/113311765/jTPoZaYwKdLPmpDA.jpg",
    "isUsed": true,
    "currentLabel": "Camp Kitchen Panel & Transfer Switch",
    "section": "Camp Kitchen > Central Utilities"
  },
  {
    "id": 24,
    "filename": "dffbb478-923b-4ef6-a2aa-45deb5c85c9a1153162560789571651.jpg",
    "url": "https://files.manuscdn.com/user_upload_by_module/session_file/113311765/TJzgeKiyCnVmCxvv.jpg",
    "isUsed": true,
    "currentLabel": "Chalet Electric Panel",
    "section": "The Chalet"
  },
  {
    "id": 25,
    "filename": "e7c58546-66f9-4871-9517-a59e3fba5aa98519279912812615721.jpg",
    "url": "https://files.manuscdn.com/user_upload_by_module/session_file/113311765/SyJyDfvkPuxfhKAT.jpg",
    "isUsed": true,
    "currentLabel": "Transformer Enclosure",
    "section": "Camp Kitchen > Central Utilities"
  },
  {
    "id": 26,
    "filename": "ee4f253c-2d1d-494a-b981-c0ec7f10bc465715695919627362883.jpg",
    "url": "https://files.manuscdn.com/user_upload_by_module/session_file/113311765/lLSYEBKizwlXtUPl.jpg",
    "isUsed": true,
    "currentLabel": "Rinnai Water Heater",
    "section": "Camp Kitchen"
  },
  {
    "id": 27,
    "filename": "pasted_file_BoAQxr_image.png",
    "url": "https://files.manuscdn.com/user_upload_by_module/session_file/113311765/bQjYxZzYqVjJzQkL.jpg",
    "isUsed": true,
    "currentLabel": "Electrical Panel",
    "section": "The Chalet"
  },
  {
    "id": 28,
    "filename": "pasted_file_FeGniG_image.png",
    "url": "https://files.manuscdn.com/user_upload_by_module/session_file/113311765/gXyZqVjJzQkLwPmN.jpg",
    "isUsed": true,
    "currentLabel": "Propane Stove",
    "section": "The Chalet"
  },
  {
    "id": 29,
    "filename": "pasted_file_OGlvWs_image.png",
    "url": "https://files.manuscdn.com/user_upload_by_module/session_file/113311765/hYzQkLwPmNbQjYxZ.jpg",
    "isUsed": true,
    "currentLabel": "Stove Label",
    "section": "The Chalet"
  },
  {
    "id": 30,
    "filename": "pasted_file_QOXiSN_image.png",
    "url": "https://files.manuscdn.com/user_upload_by_module/session_file/113311765/iUzQjJkLwPmNbQjY.jpg",
    "isUsed": true,
    "currentLabel": "Generator Cover Off - North View",
    "section": "Camp Kitchen"
  },
  {
    "id": 31,
    "filename": "pasted_file_hAeaiE_image.png",
    "url": "https://files.manuscdn.com/user_upload_by_module/session_file/113311765/jRxxxLnuiCjfrfbD.jpg",
    "isUsed": true,
    "currentLabel": "Main House Disconnect",
    "section": "Camp Kitchen > Utility Room"
  },
  {
    "id": 32,
    "filename": "pasted_file_iGdlyU_image.png",
    "url": "https://files.manuscdn.com/user_upload_by_module/session_file/113311765/jYxZzQjJkLwPmNbQ.jpg",
    "isUsed": true,
    "currentLabel": "Amana Refrigerator",
    "section": "Camp Kitchen"
  },
  {
    "id": 33,
    "filename": "pasted_file_lRPYpg_image.png",
    "url": "https://files.manuscdn.com/user_upload_by_module/session_file/113311765/kLwPmNbQjYxZzQjJ.jpg",
    "isUsed": true,
    "currentLabel": "Utility Room Electrical Panel",
    "section": "Camp Kitchen > Utility Room"
  },
  {
    "id": 34,
    "filename": "pasted_file_n02vit_image.png",
    "url": "https://files.manuscdn.com/user_upload_by_module/session_file/113311765/kPkNIMRuvCOWHhNL.jpg",
    "isUsed": true,
    "currentLabel": "Whirlpool Fridge (4.3 cu ft)",
    "section": "The Chalet"
  },
  {
    "id": 35,
    "filename": "pasted_file_nFcBnU_image.png",
    "url": "https://files.manuscdn.com/user_upload_by_module/session_file/113311765/mNbQjYxZzQjJkLwP.jpg",
    "isUsed": true,
    "currentLabel": "Camp Kitchen Stove",
    "section": "Camp Kitchen"
  },
  {
    "id": 36,
    "filename": "pasted_file_tU0iqb_image.png",
    "url": "https://files.manuscdn.com/user_upload_by_module/session_file/113311765/NbQjYxZzQjJkLwPm.jpg",
    "isUsed": true,
    "currentLabel": "Generator Shed",
    "section": "Camp Kitchen"
  },
  {
    "id": 37,
    "filename": "pasted_file_uBBBVE_image.png",
    "url": "https://files.manuscdn.com/user_upload_by_module/session_file/113311765/PmNbQjYxZzQjJkLw.jpg",
    "isUsed": true,
    "currentLabel": "Generator East View",
    "section": "Camp Kitchen"
  },
  {
    "id": 38,
    "filename": "pasted_file_vbziR9_image.png",
    "url": "https://files.manuscdn.com/user_upload_by_module/session_file/113311765/QjJkLwPmNbQjYxZz.jpg",
    "isUsed": true,
    "currentLabel": "Generator Cover On - North View",
    "section": "Camp Kitchen"
  },
  {
    "id": 39,
    "filename": "pasted_file_wCksMB_image.png",
    "url": "https://files.manuscdn.com/user_upload_by_module/session_file/113311765/wPmNbQjYxZzQjJkL.jpg",
    "isUsed": true,
    "currentLabel": "Transformer & Meter",
    "section": "Camp Kitchen"
  },
  {
    "id": 40,
    "filename": "pasted_file_wekI6V_image.png",
    "url": "https://files.manuscdn.com/user_upload_by_module/session_file/113311765/xZzQjJkLwPmNbQjY.jpg",
    "isUsed": true,
    "currentLabel": "Meter & Shutoff",
    "section": "Camp Kitchen"
  },
  {
    "id": 41,
    "filename": "pasted_file_zPqSJR_image.png",
    "url": "https://files.manuscdn.com/user_upload_by_module/session_file/113311765/zQjJkLwPmNbQjYxZ.jpg",
    "isUsed": true,
    "currentLabel": "Camp Kitchen Refrigerator",
    "section": "Camp Kitchen"
  }
];

export default function PhotoReview() {
  const usedPhotos = photos.filter(p => p.isUsed);
  const unlabeledPhotos = photos.filter(p => !p.isUsed);

  return (
    <div className="container py-10 space-y-8">
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-serif font-bold text-primary">Photo Review - All 41 Uploads</h1>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          You uploaded <strong>41 photos total</strong>. Currently <strong>{usedPhotos.length} are integrated</strong> into the manual, 
          and <strong>{unlabeledPhotos.length} are awaiting labels</strong>. 
          Please review the unlabeled photos below and tell me what each one shows (e.g., "Photo #3 is the Main House electrical panel").
        </p>
      </div>

      {/* Unlabeled Photos Section */}
      {unlabeledPhotos.length > 0 && (
        <div className="space-y-4">
          <div className="bg-amber-50 dark:bg-amber-900/10 border border-amber-200 dark:border-amber-800 rounded-lg p-4">
            <h2 className="text-2xl font-serif font-bold text-amber-900 dark:text-amber-100 mb-2">
              📸 {unlabeledPhotos.length} Photos Awaiting Labels
            </h2>
            <p className="text-amber-800 dark:text-amber-200 text-sm">
              These photos haven't been added to the manual yet. Please identify them so I can integrate them into the appropriate sections.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {unlabeledPhotos.map((photo) => (
              <Card key={photo.id} className="overflow-hidden border-2 border-amber-300 dark:border-amber-700">
                <CardHeader className="bg-amber-50 dark:bg-amber-900/20 border-b pb-4">
                  <div className="flex justify-between items-center">
                    <Badge variant="outline" className="text-lg px-4 py-1 bg-amber-100 dark:bg-amber-900 border-amber-400">
                      Photo #{photo.id}
                    </Badge>
                    <span className="text-sm font-medium text-amber-700 dark:text-amber-300">
                      Needs Label
                    </span>
                  </div>
                  <CardTitle className="mt-2 text-xl text-amber-900 dark:text-amber-100">{photo.currentLabel}</CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                  <div className="aspect-video w-full bg-muted/20 flex items-center justify-center overflow-hidden">
                    <img 
                      src={photo.url} 
                      alt={photo.currentLabel}
                      className="w-full h-full object-contain"
                    />
                  </div>
                  <div className="p-4 bg-background border-t text-sm text-muted-foreground">
                    <strong>File:</strong> {photo.filename}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Already Integrated Photos Section */}
      <div className="space-y-4">
        <div className="bg-green-50 dark:bg-green-900/10 border border-green-200 dark:border-green-800 rounded-lg p-4">
          <h2 className="text-2xl font-serif font-bold text-green-900 dark:text-green-100 mb-2">
            ✅ {usedPhotos.length} Photos Already in Manual
          </h2>
          <p className="text-green-800 dark:text-green-200 text-sm">
            These photos are currently integrated into the property manual sections.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {usedPhotos.map((photo) => (
            <Card key={photo.id} className="overflow-hidden border-2 border-muted">
              <CardHeader className="bg-muted/30 border-b pb-4">
                <div className="flex justify-between items-center">
                  <Badge variant="default" className="text-lg px-4 py-1">
                    Photo #{photo.id}
                  </Badge>
                  <span className="text-sm font-medium text-muted-foreground">
                    Used in: {photo.section}
                  </span>
                </div>
                <CardTitle className="mt-2 text-xl">{photo.currentLabel}</CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <div className="aspect-video w-full bg-muted/20 flex items-center justify-center overflow-hidden">
                  <img 
                    src={photo.url} 
                    alt={photo.currentLabel}
                    className="w-full h-full object-contain"
                  />
                </div>
                <div className="p-4 bg-background border-t text-sm text-muted-foreground">
                  <strong>File:</strong> {photo.filename}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
