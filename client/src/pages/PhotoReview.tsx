import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const photos = [
  {
    id: 1,
    url: "https://files.manuscdn.com/user_upload_by_module/session_file/113311765/FdqOlUIjWfQvyDzB.jpg",
    currentLabel: "Generator Instructions (Emergency Section)"
  },
  {
    id: 2,
    url: "https://files.manuscdn.com/user_upload_by_module/session_file/113311765/BSiJBYiUZYiFPEWd.jpg",
    currentLabel: "Farm House Refrigerator"
  },
  {
    id: 3,
    url: "https://files.manuscdn.com/user_upload_by_module/session_file/113311765/AuVzGNUJIvPpXZSq.jpg",
    currentLabel: "Beach House Dishwasher"
  },
  {
    id: 4,
    url: "https://files.manuscdn.com/user_upload_by_module/session_file/113311765/OADzIdSGqHlidPqA.jpg",
    currentLabel: "Beach House Washer/Dryer"
  },
  {
    id: 5,
    url: "https://files.manuscdn.com/user_upload_by_module/session_file/113311765/TVXbeLJBrtMTMeiC.jpg",
    currentLabel: "Beach House Water Heater"
  },
  {
    id: 6,
    url: "https://files.manuscdn.com/user_upload_by_module/session_file/113311765/df4c4dfb-0ec5-4319-9a53-4b48e915025e1628003542767182916.jpg",
    currentLabel: "Main House Entry Utility Room Panel"
  },
  {
    id: 7,
    url: "https://files.manuscdn.com/user_upload_by_module/session_file/113311765/dffbb478-923b-4ef6-a2aa-45deb5c85c9a1153162560789571651.jpg",
    currentLabel: "Main House Basement Panel"
  },
  {
    id: 8,
    url: "https://files.manuscdn.com/user_upload_by_module/session_file/113311765/GEfIzNzQvjzpJPUC.jpg",
    currentLabel: "Chalet Wall Heater"
  },
  {
    id: 9,
    url: "https://files.manuscdn.com/user_upload_by_module/session_file/113311765/KBBNXWvWOPQUMIiz.jpg",
    currentLabel: "Chalet Water Heater"
  },
  {
    id: 10,
    url: "https://files.manuscdn.com/user_upload_by_module/session_file/113311765/gFoROumoHvuSzHNQ.jpg",
    currentLabel: "Camp Kitchen - Main House Disconnect"
  },
  {
    id: 11,
    url: "https://files.manuscdn.com/user_upload_by_module/session_file/113311765/e7c58546-66f9-4871-9517-a59e3fba5aa98519279912812615721.jpg",
    currentLabel: "Camp Kitchen - Transformer"
  },
  {
    id: 12,
    url: "https://files.manuscdn.com/user_upload_by_module/session_file/113311765/ee4f253c-240f-4823-936d-1638293758362635386663583232656.jpg",
    currentLabel: "Camp Kitchen - Rinnai Water Heater"
  },
  {
    id: 13,
    url: "https://files.manuscdn.com/user_upload_by_module/session_file/113311765/d5d92cec-7a4b-48b5-9156-8d8317085e4e1534784461589245364_compressed.jpg",
    currentLabel: "Camp Kitchen - Exterior Spigot"
  },
  {
    id: 14,
    url: "https://files.manuscdn.com/user_upload_by_module/session_file/113311765/81e32e8a-7058-4926-a81e-b83471121c514600297826776263492.jpg",
    currentLabel: "Camp Kitchen - Meter & Shutoff"
  }
];

export default function PhotoReview() {
  return (
    <div className="container py-10">
      <h1 className="text-3xl font-serif text-primary mb-2">Photo Review</h1>
      <p className="text-muted-foreground mb-8">
        Please review these photos. Reply with the number and the correct label if anything is wrong.
      </p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {photos.map((photo) => (
          <Card key={photo.id} className="overflow-hidden">
            <CardHeader className="bg-muted/30 pb-2">
              <CardTitle className="text-lg flex justify-between items-center">
                <span>Photo #{photo.id}</span>
                <span className="text-sm font-normal text-muted-foreground bg-background px-2 py-1 rounded border">
                  {photo.currentLabel}
                </span>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="aspect-video relative bg-muted flex items-center justify-center overflow-hidden">
                <img 
                  src={photo.url} 
                  alt={`Photo ${photo.id}`}
                  className="object-contain w-full h-full"
                />
              </div>
              <div className="p-4 bg-background border-t">
                <p className="text-sm text-muted-foreground">
                  Is this correct? If not, tell me: <strong>"#{photo.id} is actually..."</strong>
                </p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
