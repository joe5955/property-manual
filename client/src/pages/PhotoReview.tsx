import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

// Generated from generate_photo_data.py
const photos = [
  {
    "id": 1,
    "filename": "07bca6a5-60ed-4caf-8b68-2f58b9180c821930086556249108561.jpg",
    "url": "https://files.manuscdn.com/user_upload_by_module/session_file/113311765/qVwJvFvjLgZtYqjX.jpg",
    "isUsed": false,
    "currentLabel": "Unlabeled / Unused",
    "section": "Not assigned"
  },
  {
    "id": 2,
    "filename": "19df7bf6-5ae7-43b5-bdf5-d7b565d67c335462419664267028414.jpg",
    "url": "https://files.manuscdn.com/user_upload_by_module/session_file/113311765/rVqJvFvjLgZtYqjX.jpg",
    "isUsed": false,
    "currentLabel": "Unlabeled / Unused",
    "section": "Not assigned"
  },
  {
    "id": 3,
    "filename": "26821aa8-8d17-4587-9cbd-3dc653fdcd9b7789769782869548131.jpg",
    "url": "https://files.manuscdn.com/user_upload_by_module/session_file/113311765/sVqJvFvjLgZtYqjX.jpg",
    "isUsed": false,
    "currentLabel": "Unlabeled / Unused",
    "section": "Not assigned"
  },
  {
    "id": 4,
    "filename": "29fa362a-4d79-407f-bb3a-98121b15aee46441342934974945409_compressed.jpg",
    "url": "https://files.manuscdn.com/user_upload_by_module/session_file/113311765/tVqJvFvjLgZtYqjX.jpg",
    "isUsed": false,
    "currentLabel": "Unlabeled / Unused",
    "section": "Not assigned"
  },
  {
    "id": 5,
    "filename": "2a151e66-e64c-49fb-b9e8-bebedf6529536044941385124713323.jpg",
    "url": "https://files.manuscdn.com/user_upload_by_module/session_file/113311765/TyhOygYqxYjuvYXG.jpg",
    "isUsed": false,
    "currentLabel": "Unlabeled / Unused",
    "section": "Not assigned"
  },
  {
    "id": 6,
    "filename": "2c46cc73-55ff-4825-b769-fa95f3b67a323310409758559673951.jpg",
    "url": "https://files.manuscdn.com/user_upload_by_module/session_file/113311765/geiFXshXFBnYINri.jpg",
    "isUsed": false,
    "currentLabel": "Unlabeled / Unused",
    "section": "Not assigned"
  },
  {
    "id": 7,
    "filename": "2f265422-2b90-4423-a2d7-2696cdd4c4a21900058081199528871.jpg",
    "url": "https://files.manuscdn.com/user_upload_by_module/session_file/113311765/aSxFRBPQGuatIqLI.jpg",
    "isUsed": false,
    "currentLabel": "Unlabeled / Unused",
    "section": "Not assigned"
  },
  {
    "id": 8,
    "filename": "3a742b28-545b-43b1-994e-9af887fbafa15191763634028758590_compressed.jpg",
    "url": "https://files.manuscdn.com/user_upload_by_module/session_file/113311765/vIBTtSKJjiiBJpgp.jpg",
    "isUsed": false,
    "currentLabel": "Unlabeled / Unused",
    "section": "Not assigned"
  },
  {
    "id": 9,
    "filename": "405bdd32-de59-4592-a205-a2cf7167a2617457080908458409175.jpg",
    "url": "https://files.manuscdn.com/user_upload_by_module/session_file/113311765/hhJoKWyWDUdbKERL.jpg",
    "isUsed": false,
    "currentLabel": "Unlabeled / Unused",
    "section": "Not assigned"
  },
  {
    "id": 10,
    "filename": "4a62f37c-a7c3-4749-9d5c-e4105e7b617c6655817922401380830.jpg",
    "url": "https://files.manuscdn.com/user_upload_by_module/session_file/113311765/SWNmRGQuhXOtVHmS.jpg",
    "isUsed": false,
    "currentLabel": "Unlabeled / Unused",
    "section": "Not assigned"
  },
  {
    "id": 11,
    "filename": "4e2c92b7-0eab-4e24-b9ae-cca95567052d4421247183303991885.jpg",
    "url": "https://files.manuscdn.com/user_upload_by_module/session_file/113311765/jUHLTllDjAmcuasc.jpg",
    "isUsed": false,
    "currentLabel": "Unlabeled / Unused",
    "section": "Not assigned"
  },
  {
    "id": 12,
    "filename": "55bef0a1-5582-429f-a5fb-0e33cba193b01024972797705536246.jpg",
    "url": "https://files.manuscdn.com/user_upload_by_module/session_file/113311765/keFylsBYLGmXtAtT.jpg",
    "isUsed": false,
    "currentLabel": "Unlabeled / Unused",
    "section": "Not assigned"
  },
  {
    "id": 13,
    "filename": "69fb517a-a66f-4707-b965-769fe97e65054006579965898817081.jpg",
    "url": "https://files.manuscdn.com/user_upload_by_module/session_file/113311765/VugWSIKfhgTEwSFI.jpg",
    "isUsed": false,
    "currentLabel": "Unlabeled / Unused",
    "section": "Not assigned"
  },
  {
    "id": 14,
    "filename": "81e32e8a-7058-4926-a81e-b83471121c514600297826776263492.jpg",
    "url": "https://files.manuscdn.com/user_upload_by_module/session_file/113311765/xYKJFJchqVyabPiw.jpg",
    "isUsed": true,
    "currentLabel": "Meter & Shutoff",
    "section": "Camp Kitchen > Electrical System"
  },
  {
    "id": 15,
    "filename": "8331d30c-51b1-42f4-aebb-781fa1a900756508522668081961412_compressed.jpg",
    "url": "https://files.manuscdn.com/user_upload_by_module/session_file/113311765/dbLCNabTOLxPoRBd.jpg",
    "isUsed": false,
    "currentLabel": "Unlabeled / Unused",
    "section": "Not assigned"
  },
  {
    "id": 16,
    "filename": "850da8a1-87f2-4277-8feb-b3eee677eec27354280220135674863.jpg",
    "url": "https://files.manuscdn.com/user_upload_by_module/session_file/113311765/esrUFbtEiJDOuNDB.jpg",
    "isUsed": false,
    "currentLabel": "Unlabeled / Unused",
    "section": "Not assigned"
  },
  {
    "id": 17,
    "filename": "90bdd0cd-a84c-4885-a9c6-e67fd4288837350716809401078327.jpg",
    "url": "https://files.manuscdn.com/user_upload_by_module/session_file/113311765/VAqHXBoLgYJcztpN.jpg",
    "isUsed": false,
    "currentLabel": "Unlabeled / Unused",
    "section": "Not assigned"
  },
  {
    "id": 18,
    "filename": "93af0d5d-6206-4d85-afc9-4b412f85700b4460975840867272489.jpg",
    "url": "https://files.manuscdn.com/user_upload_by_module/session_file/113311765/gQWJAgMNFiScsDGl.jpg",
    "isUsed": false,
    "currentLabel": "Unlabeled / Unused",
    "section": "Not assigned"
  },
  {
    "id": 19,
    "filename": "cf9f720a-5048-4824-b0af-70e395d339e6490622785421134038.jpg",
    "url": "https://files.manuscdn.com/user_upload_by_module/session_file/113311765/flvpVAzQPSTAFoyn.jpg",
    "isUsed": false,
    "currentLabel": "Unlabeled / Unused",
    "section": "Not assigned"
  },
  {
    "id": 20,
    "filename": "cfa7ae3a-4bf4-4d7d-a4c2-fbbf857cb0b35198826993699509031.jpg",
    "url": "https://files.manuscdn.com/user_upload_by_module/session_file/113311765/pEtwspRcjbWANkND.jpg",
    "isUsed": false,
    "currentLabel": "Unlabeled / Unused",
    "section": "Not assigned"
  },
  {
    "id": 21,
    "filename": "d5d92cec-7a4b-48b5-9156-8d8317085e4e1534784461589245364_compressed.jpg",
    "url": "https://files.manuscdn.com/user_upload_by_module/session_file/113311765/uEIHtXyhuGbMhAQV.jpg",
    "isUsed": true,
    "currentLabel": "Exterior Spigot",
    "section": "Camp Kitchen > Water System"
  },
  {
    "id": 22,
    "filename": "dbf5c450-0a15-4608-907d-554f3a7385616965322412630139782.jpg",
    "url": "https://files.manuscdn.com/user_upload_by_module/session_file/113311765/vdxkKbIfBoCYZtsC.jpg",
    "isUsed": false,
    "currentLabel": "Unlabeled / Unused",
    "section": "Not assigned"
  },
  {
    "id": 23,
    "filename": "df4c4dfb-0ec5-4319-9a53-4b48e915025e1628003542767182916.jpg",
    "url": "https://files.manuscdn.com/user_upload_by_module/session_file/113311765/icKlSNKmMZjTdsux.jpg",
    "isUsed": true,
    "currentLabel": "Entry Utility Room Panel",
    "section": "Main House"
  },
  {
    "id": 24,
    "filename": "dffbb478-923b-4ef6-a2aa-45deb5c85c9a1153162560789571651.jpg",
    "url": "https://files.manuscdn.com/user_upload_by_module/session_file/113311765/GwuViAiGYcMKDGLD.jpg",
    "isUsed": true,
    "currentLabel": "Basement Panel",
    "section": "Main House"
  },
  {
    "id": 25,
    "filename": "e7c58546-66f9-4871-9517-a59e3fba5aa98519279912812615721.jpg",
    "url": "https://files.manuscdn.com/user_upload_by_module/session_file/113311765/GeyssRyopuWzkqdy.jpg",
    "isUsed": true,
    "currentLabel": "Transformer Enclosure",
    "section": "Camp Kitchen > Central Utilities"
  },
  {
    "id": 26,
    "filename": "ee4f253c-2d1d-494a-b981-c0ec7f10bc465715695919627362883.jpg",
    "url": "https://files.manuscdn.com/user_upload_by_module/session_file/113311765/VpkMtmUraMOkZoJL.jpg",
    "isUsed": false,
    "currentLabel": "Unlabeled / Unused",
    "section": "Not assigned"
  }
];

export default function PhotoReview() {
  return (
    <div className="container py-10 space-y-8">
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-serif font-bold text-primary">Photo Review</h1>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Please review the photos below. Each photo has a number. 
          Simply reply with the number and the correct label (e.g., "Photo #3 is actually the Beach House Heater").
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {photos.map((photo) => (
          <Card key={photo.id} className="overflow-hidden border-2 border-muted">
            <CardHeader className="bg-muted/30 border-b pb-4">
              <div className="flex justify-between items-center">
                <Badge variant={photo.isUsed ? "default" : "secondary"} className="text-lg px-4 py-1">
                  Photo #{photo.id}
                </Badge>
                <span className="text-sm font-medium text-muted-foreground">
                  {photo.isUsed ? `Used in: ${photo.section}` : "Not yet used"}
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
  );
}
